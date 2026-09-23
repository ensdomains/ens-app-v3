export interface KnownAgentRegistry {
  name: string
  chainId: number
  address: string
}

export const KNOWN_AGENT_REGISTRIES: KnownAgentRegistry[] = [
  {
    name: '8004.eth',
    chainId: 1,
    address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
  },
]

/**
 * Looks up a known registry name by chain ID and address.
 *
 * @param chainId - The EVM chain ID
 * @param address - The registry contract address
 * @returns The registry name (e.g., "8004.eth") or null if unknown
 */
export function getKnownRegistryName(chainId: number, address: string): string | null {
  const normalizedAddress = address.toLowerCase()
  const registry = KNOWN_AGENT_REGISTRIES.find(
    (r) => r.chainId === chainId && r.address.toLowerCase() === normalizedAddress,
  )
  return registry?.name ?? null
}
