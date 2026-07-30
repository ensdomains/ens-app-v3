/**
 * Blocks until the local ENS stack is genuinely usable: contracts deployed on the chain and the
 * subgraph indexed up to the chain head.
 *
 * `.env.local` existing is not enough - it is written by the deploy but survives across runs, so a
 * stale copy in the working tree would let the workflow race ahead of a fresh deploy.
 */
import { readFileSync } from 'node:fs'

const RPC_URL = process.env.ANVIL_RPC_URL ?? 'http://localhost:8545'
const SUBGRAPH_URL = process.env.SUBGRAPH_URL ?? 'http://localhost:42069/subgraph'
const TIMEOUT_MS = Number(process.env.WAIT_FOR_STACK_TIMEOUT ?? 600_000)

const deadline = Date.now() + TIMEOUT_MS
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

const registryAddress = () => {
  const env = readFileSync('.env.local', 'utf8')
  const line = env.split('\n').find((l) => l.startsWith('NEXT_PUBLIC_DEPLOYMENT_ADDRESSES='))
  if (!line) throw new Error('NEXT_PUBLIC_DEPLOYMENT_ADDRESSES missing from .env.local')
  const addresses = JSON.parse(line.slice(line.indexOf('=') + 1).replace(/^'|'$/g, ''))
  if (!addresses.ENSRegistry) throw new Error('ENSRegistry missing from deployment addresses')
  return addresses.ENSRegistry
}

const waitFor = async (label, check) => {
  let lastError = 'no attempt completed'
  while (Date.now() < deadline) {
    try {
      const detail = await check()
      if (detail) {
        console.log(`✓ ${label}: ${detail}`)
        return
      }
    } catch (error) {
      lastError = error.message
    }
    await sleep(3000)
  }
  throw new Error(`timed out waiting for ${label} (last error: ${lastError})`)
}

const registry = registryAddress()

await waitFor(`chain ${RPC_URL}`, async () => {
  const chainId = Number(await rpc('eth_chainId'))
  return `chain id ${chainId}`
})

await waitFor(`contracts deployed (ENSRegistry ${registry})`, async () => {
  const code = await rpc('eth_getCode', [registry, 'latest'])
  return code && code !== '0x' ? `${(code.length - 2) / 2} bytes of code` : null
})

await waitFor(`subgraph ${SUBGRAPH_URL} in sync`, async () => {
  const head = Number(await rpc('eth_blockNumber'))
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: '{ _meta { hasIndexingErrors block { number } } }' }),
  })
  const { data, errors } = await res.json()
  if (errors) throw new Error(JSON.stringify(errors))
  if (data._meta.hasIndexingErrors) throw new Error('subgraph reports indexing errors')
  const indexed = data._meta.block.number
  return indexed >= head ? `block ${indexed} >= chain head ${head}` : null
})

console.log('stack ready')
