import type { ClientWithEns } from '@app/types'

/**
 * Extracts and normalizes chain name from a Viem client
 * Follows the same pattern as getChainName but works with client objects
 * @param client - Viem client with chain information
 * @returns Normalized chain name (e.g., 'mainnet', 'sepolia')
 */
export const getChainNameForClient = (client: ClientWithEns): string => {
  const chainId = client.chain.id
  if (chainId === 1 || !chainId) return 'mainnet'
  return client.chain.name.toLowerCase()
}
