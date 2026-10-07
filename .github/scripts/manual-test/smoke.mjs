/**
 * Fails fast if the manual-test harness is broken, before a Claude session is started.
 *
 * Boots a real Playwright MCP server with the --init-page hook, loads the app through it, and checks
 * that the mock wallet and the chain-time clock are actually in the page, plus that the control
 * server responds. Exits non-zero with a diagnosis if not.
 *
 * Usage: node .github/scripts/manual-test/smoke.mjs [--app http://localhost:3000] [--port 8931]
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const APP_URL = getArg('app', process.env.APP_URL ?? 'http://localhost:3000')
const MCP_PORT = Number(getArg('port', 8931))
const CONTROL_URL = `http://127.0.0.1:${process.env.MANUAL_TEST_CONTROL_PORT ?? 8546}`
const INIT_PAGE = new URL('./init-page.cjs', import.meta.url).pathname

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Spawn from the very same MCP config the Claude session gets, when there is one, so the smoke test
// cannot pass with arguments the real session does not use.
const fromConfig = () => {
  if (!process.env.MCP_CONFIG) return null
  const config = JSON.parse(readFileSync(process.env.MCP_CONFIG, 'utf8'))
  const server = config.mcpServers?.playwright
  if (!server?.command) return null
  console.log(`using MCP config ${process.env.MCP_CONFIG}`)
  return { command: server.command, args: [...(server.args ?? []), '--port', String(MCP_PORT)] }
}

const spec = fromConfig() ?? {
  command: 'npx',
  args: [
    '-y',
    '@playwright/mcp@latest',
    '--headless',
    '--isolated',
    // without this MCP looks for system Chrome at /opt/google/chrome/chrome
    '--browser',
    'chromium',
    '--port',
    String(MCP_PORT),
    '--init-page',
    INIT_PAGE,
  ],
}

const mcp = spawn(
  spec.command,
  spec.args,
  // own process group, so the browser and the npx wrapper die with us and free port 8546 for the
  // MCP server the Claude session starts
  { stdio: ['ignore', 'pipe', 'pipe'], detached: true },
)
const stopMcp = () => {
  try {
    process.kill(-mcp.pid, 'SIGKILL')
  } catch {
    /* already gone */
  }
}
process.on('exit', stopMcp)
let mcpOutput = ''
mcp.stdout.on('data', (chunk) => {
  mcpOutput += chunk
})
mcp.stderr.on('data', (chunk) => {
  mcpOutput += chunk
})

const fail = (message) => {
  console.error(`\n✗ ${message}`)
  console.error(`\n--- mcp output ---\n${mcpOutput.trim()}`)
  stopMcp()
  process.exit(1)
}

// MCP binds "localhost", which may resolve to ::1 - use the hostname, not 127.0.0.1.
const ENDPOINT = `http://localhost:${MCP_PORT}/mcp`
let sessionId = null
let requestId = 0

const rpc = async (method, params) => {
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }
  if (sessionId) headers['mcp-session-id'] = sessionId
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: ++requestId, method, params }),
  })
  if (res.headers.get('mcp-session-id')) sessionId = res.headers.get('mcp-session-id')
  const body = await res.text()
  const line = body.split('\n').find((l) => l.startsWith('data: ')) ?? body
  const json = JSON.parse(line.replace(/^data: /, ''))
  if (json.error) throw new Error(`${method}: ${JSON.stringify(json.error)}`)
  return json.result
}

const callTool = async (name, args_) => {
  const result = await rpc('tools/call', { name, arguments: args_ })
  const text = (result.content ?? []).map((c) => c.text).join('\n')
  if (result.isError || /^### Error/m.test(text)) throw new Error(`${name}: ${text}`)
  return text
}

// A tool result looks like "### Result\n<json>\n### Ran Playwright code\n```js ...```" - take just
// the JSON under the Result heading.
export const resultValue = (text) => {
  const start = text.indexOf('### Result')
  const body = start === -1 ? text : text.slice(start + '### Result'.length)
  const end = body.indexOf('\n### ')
  const json = (end === -1 ? body : body.slice(0, end)).trim()
  return JSON.parse(json.replace(/^```(?:json)?/, '').replace(/```$/, '').trim())
}

// --- wait for the MCP server to listen ---------------------------------------------------------
let up = false
for (let i = 0; i < 60 && !up; i += 1) {
  try {
    await rpc('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'manual-test-smoke', version: '1' },
    })
    up = true
  } catch {
    await sleep(1000)
  }
}
if (!up) fail(`Playwright MCP did not start on port ${MCP_PORT}`)

await fetch(ENDPOINT, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    'mcp-session-id': sessionId,
  },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
})
console.log('✓ MCP server up')

// --- app reachable? ----------------------------------------------------------------------------
// The dev server is started in an earlier step and can die in between (a backgrounded child that
// is not in its own session gets torn down with the step). Diagnose that here with its log, rather
// than surfacing a bare ERR_CONNECTION_REFUSED from the browser.
const devLogTail = () => {
  try {
    return readFileSync('/tmp/dev.log', 'utf8').trim().split('\n').slice(-15).join('\n')
  } catch {
    return '(no /tmp/dev.log)'
  }
}

let appUp = false
for (let i = 0; i < 30 && !appUp; i += 1) {
  try {
    const res = await fetch(APP_URL, { redirect: 'manual' })
    appUp = res.status < 500
  } catch {
    await sleep(2000)
  }
}
if (!appUp) {
  console.error(`\n--- dev server log ---\n${devLogTail()}`)
  fail(`the app is not serving on ${APP_URL} - the dev server is not running any more`)
}

// --- load the app ------------------------------------------------------------------------------
try {
  await callTool('browser_navigate', { url: APP_URL })
  console.log(`✓ loaded ${APP_URL}`)
} catch (error) {
  console.error(`\n--- dev server log ---\n${devLogTail()}`)
  fail(`could not load the app at ${APP_URL}: ${error.message}`)
}

// --- wallet + clock in the page ----------------------------------------------------------------
let probe
try {
  const text = await callTool('browser_evaluate', {
    function: `async () => {
      if (!window.ethereum) return { error: 'window.ethereum missing - init-page did not run' }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      const announced = []
      window.addEventListener('eip6963:announceProvider', (e) => announced.push(e.detail.info.name))
      window.dispatchEvent(new Event('eip6963:requestProvider'))
      await new Promise((r) => setTimeout(r, 100))
      return { accounts, chainId, announced, pageTime: Math.floor(Date.now() / 1000) }
    }`,
  })
  probe = resultValue(text)
} catch (error) {
  fail(`wallet probe failed: ${error.message}`)
}

if (probe.error) fail(probe.error)
if (!probe.accounts?.length) fail('mock wallet returned no accounts (request was not auto-approved?)')
if (!probe.announced?.includes('Headless Web3 Provider'))
  fail(`wallet not announced over EIP-6963 (announced: ${JSON.stringify(probe.announced)})`)
console.log(`✓ mock wallet: ${probe.accounts[0]} on chain ${probe.chainId}, announced as "Headless Web3 Provider"`)

// --- control server ----------------------------------------------------------------------------
let state
try {
  state = await (await fetch(`${CONTROL_URL}/state`)).json()
} catch (error) {
  fail(`control server not reachable at ${CONTROL_URL}: ${error.message}`)
}
console.log(`✓ control server: user ${state.user}, chain ${state.chainId}, block time ${new Date(state.blockTimestamp * 1000).toISOString()}`)

const drift = Math.abs(probe.pageTime - state.blockTimestamp)
if (drift > 300) fail(`page clock is ${drift}s from chain time - the clock hook did not take effect`)
console.log(`✓ page clock within ${drift}s of chain time`)

// --- app actually rendered ---------------------------------------------------------------------
try {
  const snapshot = await callTool('browser_snapshot', {})
  if (!/connect/i.test(snapshot)) fail('app rendered but no connect control found in the snapshot')
  console.log('✓ app rendered with a connect control')
} catch (error) {
  fail(`snapshot failed: ${error.message}`)
}

console.log('\nharness OK')
stopMcp()
process.exit(0)
