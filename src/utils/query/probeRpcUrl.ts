import { BaseError, createPublicClient, http } from 'viem'

export type ProbeFailureReason = 'wrongChain' | 'unreachable' | 'timeout' | 'invalidResponse'

export type ProbeResult =
  | { success: true }
  | { success: false; reason: ProbeFailureReason; reportedChainId?: number }

export const PROBE_TIMEOUT = 5000

/**
 * Classifies a thrown probe error into a user-facing reason.
 *
 * `fallback()` cannot detect a wrong-chain endpoint at runtime (it answers successfully and
 * silently returns wrong data), so a save-time liveness probe is the only honest guard. This
 * also surfaces the common self-hosted-node failure: no CORS headers, which the browser
 * reports as a network error rather than a helpful message.
 */
export const classifyProbeError = (err: unknown): ProbeFailureReason => {
  const hasName = (e: unknown): e is { name: string } =>
    typeof (e as { name?: unknown })?.name === 'string'

  if (err instanceof BaseError) {
    if (err.walk((e) => hasName(e) && e.name === 'TimeoutError')) return 'timeout'
    if (err.walk((e) => hasName(e) && e.name === 'HttpRequestError')) return 'unreachable'
    return 'invalidResponse'
  }

  if (hasName(err)) {
    if (err.name === 'TimeoutError') return 'timeout'
    if (err.name === 'HttpRequestError') return 'unreachable'
  }
  return 'invalidResponse'
}

/**
 * Liveness probe run at save time. Issues a single `eth_chainId` call against the endpoint
 * and asserts it matches the active chain. No retries, short timeout — this is a fast
 * accept/reject gate, not part of the request path.
 */
export const probeRpcUrl = async ({
  url,
  chainId,
}: {
  url: string
  chainId: number
}): Promise<ProbeResult> => {
  try {
    const client = createPublicClient({
      transport: http(url, { timeout: PROBE_TIMEOUT, retryCount: 0 }),
    })
    const reportedChainId = await client.getChainId()
    if (reportedChainId !== chainId)
      return { success: false, reason: 'wrongChain', reportedChainId }
    return { success: true }
  } catch (err) {
    return { success: false, reason: classifyProbeError(err) }
  }
}
