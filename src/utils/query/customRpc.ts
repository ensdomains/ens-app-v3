import { getStorageValue } from '@app/hooks/useLocalStorage'

/**
 * Per-device custom RPC endpoint overrides.
 *
 * Stored under a single localStorage key, keyed by chainId. Each ENS deployment serves exactly
 * one chain per origin: app.ens.domains = mainnet and legacy.sepolia.app.ens.domains = sepolia.
 * They use separate localStorage, so only the active chain's entry is exercised on a device.
 * Cross-device sync is out of scope until SIWE lands.
 *
 * The key lives outside the reserved `wagmi*` namespace so it is not touched by wagmi's
 * own storage middleware.
 */
export const CUSTOM_RPC_STORAGE_KEY = 'customRpcUrls'

export type CustomRpcConfig = {
  url: string
  /** When true, the custom endpoint is used exclusively with no DRPC/Tenderly fallback. */
  exclusive: boolean
}

export type CustomRpcUrls = Record<number, CustomRpcConfig>

export const getCustomRpcUrls = (): CustomRpcUrls =>
  getStorageValue<CustomRpcUrls>(CUSTOM_RPC_STORAGE_KEY, {})

/**
 * Returns the configured custom RPC for a chain, or `undefined` when none is set (or the
 * stored entry has no url). Reads from localStorage by default but accepts a pre-read map
 * so callers can avoid repeated storage hits.
 */
export const getCustomRpcForChain = (
  chainId: number,
  urls: CustomRpcUrls = getCustomRpcUrls(),
): CustomRpcConfig | undefined => {
  const entry = urls[chainId]
  if (!entry?.url) return undefined
  return entry
}
