/**
 * Decodes an ERC-7930 binary address format.
 *
 * Format:
 * - Version (2 bytes): 0x0001
 * - ChainType (2 bytes): 0x0000 for EVM
 * - ChainReferenceLength (1 byte)
 * - ChainReference (variable): Chain ID
 * - AddressLength (1 byte): Should be 20
 * - Address (20 bytes)
 *
 * @param hex - The hex-encoded ERC-7930 address
 * @returns Decoded chain ID and address, or null if invalid
 */
export function decodeErc7930Address(
  hex: string,
): { chainId: number; address: `0x${string}` } | null {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex

  // Minimum length check: 2 + 2 + 1 + 1 + 1 + 20 = 27 bytes = 54 hex chars
  if (cleanHex.length < 54) return null

  let offset = 0

  // Version (2 bytes)
  const version = cleanHex.slice(offset, offset + 4)
  offset += 4
  if (version !== '0001') return null

  // ChainType (2 bytes)
  const chainType = cleanHex.slice(offset, offset + 4)
  offset += 4
  if (chainType !== '0000') return null // Only EVM supported

  // ChainReferenceLength (1 byte)
  const chainRefLength = parseInt(cleanHex.slice(offset, offset + 2), 16)
  offset += 2
  if (chainRefLength === 0 || chainRefLength > 32) return null

  // ChainReference (variable)
  const chainRefHex = cleanHex.slice(offset, offset + chainRefLength * 2)
  offset += chainRefLength * 2
  if (chainRefHex.length !== chainRefLength * 2) return null

  const chainId = parseInt(chainRefHex, 16)
  if (Number.isNaN(chainId)) return null

  // AddressLength (1 byte)
  const addressLength = parseInt(cleanHex.slice(offset, offset + 2), 16)
  offset += 2
  if (addressLength !== 20) return null

  // Address (20 bytes)
  const addressHex = cleanHex.slice(offset, offset + 40)
  if (addressHex.length !== 40) return null

  return {
    chainId,
    address: `0x${addressHex}` as `0x${string}`,
  }
}
