import { extractChain } from 'viem'
import * as chains from 'viem/chains'

export interface ChainInfo {
  name: string
  explorerUrl: string | null
}

/**
 * Gets chain information (name and block explorer URL) from a chain ID.
 * Uses viem's chain registry for lookup.
 *
 * @param chainId - The EVM chain ID
 * @returns Chain info with name and explorer URL
 */
export function getChainInfo(chainId: number): ChainInfo {
  const chain = extractChain({
    chains: Object.values(chains),
    id: chainId as (typeof chains.mainnet)['id'],
  })

  if (chain) {
    return {
      name: chain.name.toLowerCase(),
      explorerUrl: chain.blockExplorers?.default?.url ?? null,
    }
  }

  // Fallback for unknown chains
  return {
    name: `chain:${chainId}`,
    explorerUrl: null,
  }
}

/**
 * Builds a block explorer URL for an address.
 *
 * @param explorerUrl - The base explorer URL (or null)
 * @param address - The address to link to
 * @returns Full URL or null if no explorer available
 */
export function buildAddressExplorerUrl(
  explorerUrl: string | null,
  address: string,
): string | null {
  if (!explorerUrl) return null
  return `${explorerUrl}/address/${address}`
}
