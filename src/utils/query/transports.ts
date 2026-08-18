import type { Transport } from 'viem'
import { fallback, http, webSocket } from 'wagmi'

import { isValidRpcUrl } from '@app/validators/validateRpcUrl'

import type { CustomRpcConfig } from './customRpc'

const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'
const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY || 'AnmpasF2C0JBqeAEzxVO8aRuvzLTrWcR75hmDonbV6cR'

const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`

export const drpcUrl = (chainName: string) =>
  `https://lb.drpc.org/ogrpc?network=${
    chainName === 'mainnet' ? 'ethereum' : chainName
  }&dkey=${drpcKey}`

export const drpcWsUrl = (chainName: string) =>
  `wss://lb.drpc.org/ogws?network=${
    chainName === 'mainnet' ? 'ethereum' : chainName
  }&dkey=${drpcKey}`

export type TransportSpec = { type: 'ws' | 'http'; url: string }

/** The default ENS-adjacent transports (DRPC websocket + DRPC/Tenderly HTTP fallbacks). */
export const getDefaultTransportSpecs = (chainName: string): TransportSpec[] => [
  { type: 'ws', url: drpcWsUrl(chainName) }, // Primary: instant block updates via subscription
  { type: 'http', url: drpcUrl(chainName) }, // Fallback 1: DRPC HTTP
  { type: 'http', url: tenderlyUrl(chainName) }, // Fallback 2: Tenderly HTTP
]

/**
 * Pure transport selection. Given the default specs and an optional user override:
 *   - no / invalid custom url  -> defaults only
 *   - valid custom url         -> custom url first (primary), defaults kept as fallback
 *   - valid custom + exclusive -> custom url only (no ENS-adjacent fallback)
 *
 * Invalid custom urls fall through to the defaults so a corrupt localStorage value can
 * never brick the app.
 */
export const getTransportSpecs = ({
  chainName,
  customRpc,
}: {
  chainName: string
  customRpc?: CustomRpcConfig
}): TransportSpec[] => {
  const defaults = getDefaultTransportSpecs(chainName)
  if (!customRpc || !isValidRpcUrl(customRpc.url)) return defaults

  const userSpec: TransportSpec = { type: 'http', url: customRpc.url }
  return customRpc.exclusive ? [userSpec] : [userSpec, ...defaults]
}

const specToTransport = (spec: TransportSpec): Transport =>
  spec.type === 'ws' ? webSocket(spec.url) : http(spec.url)

export const buildChainTransport = (args: { chainName: string; customRpc?: CustomRpcConfig }) =>
  fallback(getTransportSpecs(args).map(specToTransport))
