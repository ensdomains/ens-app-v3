/**
 * Parses an ENSIP-25 agent-registration text record key.
 *
 * Format: agent-registration[<ERC-7930 registry address>][<agentId>]
 *
 * @param key - The text record key to parse
 * @returns Parsed registry hex and agent ID, or null if invalid
 */
export function parseAgentRegistrationKey(
  key: string,
): { registryHex: string; agentId: string } | null {
  const prefix = 'agent-registration['

  if (!key.startsWith(prefix)) return null

  // Find the closing bracket of the first section
  const firstCloseIndex = key.indexOf('][')
  if (firstCloseIndex === -1) return null

  // Extract registry (between first [ and ][)
  const registryHex = key.slice(prefix.length, firstCloseIndex)

  // Extract agentId (between ][ and final ])
  const agentIdStart = firstCloseIndex + 2
  const agentIdEnd = key.lastIndexOf(']')
  if (agentIdEnd <= agentIdStart) return null

  const agentId = key.slice(agentIdStart, agentIdEnd)

  // Validate registry looks like hex
  if (!registryHex.startsWith('0x')) return null

  return { registryHex: registryHex.toLowerCase(), agentId }
}

/**
 * Checks if a text record key is an agent-registration key.
 */
export function isAgentRegistrationKey(key: string): boolean {
  return key.startsWith('agent-registration[')
}
