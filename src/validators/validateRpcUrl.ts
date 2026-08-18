// Only HTTP(S) JSON-RPC endpoints are supported in v1 (no WebSocket custom endpoints).
const ACCEPTED_RPC_PROTOCOLS = ['http:', 'https:']

export type RpcUrlError = 'required' | 'invalidUrl' | 'invalidProtocol'

/**
 * Validates a user supplied JSON-RPC endpoint URL.
 *
 * Unlike {@link validateImageUri} this deliberately does NOT block localhost / LAN /
 * numeric IP addresses: users routinely run their own node (e.g. http://localhost:8545)
 * and pointing the app at it is the whole point of the feature. The save-time liveness
 * probe ({@link probeRpcUrl}) is what protects against a dead or wrong-chain endpoint.
 *
 * @returns `true` when valid, otherwise a stable error key for i18n lookup.
 */
export const validateRpcUrl = (url?: string): true | RpcUrlError => {
  if (!url) return 'required'

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return 'invalidUrl'
  }

  if (!ACCEPTED_RPC_PROTOCOLS.includes(parsed.protocol)) return 'invalidProtocol'

  return true
}

export const isValidRpcUrl = (url?: string): boolean => validateRpcUrl(url) === true
