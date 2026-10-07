/**
 * Playwright MCP `--init-page` module: gives an MCP-driven browser the same wallet and the same
 * clock handling the e2e suite gets from its Playwright fixtures.
 *
 * The MCP server calls `module.exports.default({ page })` once per tab, before the tab navigates,
 * so this is the equivalent of the `wallet` + `time` fixtures in playwright/index.ts:
 *   - injects @ensdomains/headless-web3-provider (the mock wallet the e2e suite uses), with every
 *     request kind in `permitted` so nothing needs manual authorization
 *   - installs the page clock at the anvil block timestamp (local chain time is not real time)
 *
 * It also exposes a small control server so the agent driving the browser can switch accounts and
 * travel in time from the shell — see README.md.
 *
 * IMPORTANT: this runs inside the MCP server process, which speaks JSON-RPC over stdout. All
 * logging must go to stderr.
 */
const { createServer } = require('node:http')

const { injectHeadlessWeb3Provider, Web3RequestKind } = require('@ensdomains/headless-web3-provider')
const { bytesToHex, createPublicClient, createTestClient, http } = require('viem')
const { mnemonicToAccount } = require('viem/accounts')
const { anvil } = require('viem/chains')

const RPC_URL = process.env.ANVIL_RPC_URL || 'http://localhost:8545'
const CONTROL_PORT = Number(process.env.MANUAL_TEST_CONTROL_PORT || 8546)
const MNEMONIC = process.env.SECRET_WORDS || 'test test test test test test test test test test test junk'

// Same account ordering/naming as playwright/fixtures/accounts.ts
const USERS = ['user', 'user2', 'user3', 'user4']
const accounts = USERS.map((_, addressIndex) => mnemonicToAccount(MNEMONIC, { addressIndex }))
const privateKeys = accounts.map((account) => bytesToHex(account.getHdKey().privateKey))

const log = (...parts) => console.error('[manual-test]', ...parts)

// Every request kind is pre-authorized: there is no human to confirm a popup.
const permitted = Object.values(Web3RequestKind)

const state = {
  chainId: null,
  activeUser: 'user',
  tabs: [], // { page, wallet }
  controlServer: null,
  clients: null,
}

const clients = () => {
  if (!state.clients) {
    const chain = { ...anvil, id: state.chainId }
    const transport = http(RPC_URL)
    state.clients = {
      publicClient: createPublicClient({ chain, transport }),
      testClient: createTestClient({ chain, transport, mode: 'anvil' }),
    }
  }
  return state.clients
}

const rpc = async (method, params = []) => {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

// ens-test-env runs anvil with --chain-id 1337, but read it back: signing against the wrong chain
// id fails with a confusing "invalid chain id for signer".
const chainId = async () => {
  if (state.chainId === null) state.chainId = Number(await rpc('eth_chainId'))
  return state.chainId
}

const currentBlockTimestamp = async () => Number((await clients().publicClient.getBlock()).timestamp)

const liveTabs = () => {
  state.tabs = state.tabs.filter(({ page }) => !page.isClosed())
  return state.tabs
}

const privateKeysFor = (user) => {
  const index = USERS.indexOf(user)
  // active account first - the mock wallet reports accounts in order
  return [privateKeys[index], ...privateKeys.filter((_, i) => i !== index)]
}

// Pull every open page onto the current chain time. Used after time travel, and available on
// /clock/sync for when a flow has left the page clock behind.
const syncClock = async () => {
  const timestamp = await currentBlockTimestamp()
  await Promise.all(
    liveTabs().map(({ page }) =>
      page.clock.setSystemTime(new Date(timestamp * 1000)).catch((error) => {
        log('clock sync failed', error.message)
      }),
    ),
  )
  return timestamp
}

const controlState = async () => ({
  user: state.activeUser,
  address: accounts[USERS.indexOf(state.activeUser)].address,
  chainId: state.chainId,
  blockTimestamp: await currentBlockTimestamp(),
  tabs: liveTabs().length,
})

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })

const send = (res, status, payload) => {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(payload, (_, value) => (typeof value === 'bigint' ? value.toString() : value)))
}

const startControlServer = () => {
  if (state.controlServer) return

  state.controlServer = createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url, 'http://127.0.0.1')

      if (pathname === '/state') return send(res, 200, await controlState())

      if (pathname === '/account') {
        const { user } = await readBody(req)
        if (!USERS.includes(user)) return send(res, 400, { error: `unknown user: ${user}` })
        state.activeUser = user
        const keys = privateKeysFor(user)
        await Promise.all(liveTabs().map(({ wallet }) => wallet.changeAccounts(keys)))
        log('active account ->', user, accounts[USERS.indexOf(user)].address)
        return send(res, 200, await controlState())
      }

      if (pathname === '/time/advance') {
        const { seconds } = await readBody(req)
        const { testClient } = clients()
        await testClient.increaseTime({ seconds: Number(seconds) })
        await testClient.mine({ blocks: 1 })
        const timestamp = await syncClock()
        log(`advanced chain by ${seconds}s, page clock now ${new Date(timestamp * 1000).toISOString()}`)
        return send(res, 200, await controlState())
      }

      if (pathname === '/clock/sync') {
        const timestamp = await syncClock()
        log('page clock synced to block time', new Date(timestamp * 1000).toISOString())
        return send(res, 200, await controlState())
      }

      return send(res, 404, { error: 'not found' })
    } catch (error) {
      log('control error', error.message)
      return send(res, 500, { error: error.message })
    }
  })

  state.controlServer.on('error', (error) => log('control server error', error.message))
  state.controlServer.listen(CONTROL_PORT, '127.0.0.1', () =>
    log(`control server on http://127.0.0.1:${CONTROL_PORT}`),
  )
  state.controlServer.unref()
}

module.exports.default = async ({ page }) => {
  const id = await chainId()

  const wallet = await injectHeadlessWeb3Provider({
    page,
    privateKeys: privateKeysFor(state.activeUser),
    chains: [{ ...anvil, id }],
    permitted,
    debug: !!process.env.MANUAL_TEST_WALLET_DEBUG,
    logger: log,
  })

  // Mirrors the `time` fixture: the browser must run on chain time, or every name looks expired.
  const timestamp = await currentBlockTimestamp()
  await page.clock.install({ time: new Date(timestamp * 1000) })

  state.tabs.push({ page, wallet })
  startControlServer()

  log(
    `tab ready - chain ${id}, account ${state.activeUser} ` +
      `(${accounts[USERS.indexOf(state.activeUser)].address}), clock ${new Date(timestamp * 1000).toISOString()}`,
  )
}
