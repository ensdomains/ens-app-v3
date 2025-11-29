import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'
import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'

import { ClientWithEns } from '@app/types'

import { getReferrerHex, resolveReferrerToHex } from './referrer'

// Mock ensjs functions
vi.mock('@ensdomains/ensjs/public', () => ({
  getAddressRecord: vi.fn(),
  getOwner: vi.fn(),
}))

describe('getReferrerHex', () => {
  it('should validate and pad valid hex strings to 32 bytes', () => {
    const referrer = '0x1234abcd'
    const result = getReferrerHex(referrer)

    // Should be 32 bytes (66 chars including '0x')
    expect(result.length).toBe(66)
    expect(result).toMatch(/^0x[0-9a-f]{64}$/i)
    // Viem's pad pads on the left (prepends zeros)
    expect(result.endsWith('1234abcd')).toBe(true)
    expect(result.startsWith('0x00')).toBe(true) // padded with zeros on left
  })

  it('should handle empty referrer by returning EMPTY_BYTES32', () => {
    const result = getReferrerHex(undefined)
    expect(result).toBe(EMPTY_BYTES32)
    expect(result).toMatch(/^0x0+$/)
  })

  it('should reject invalid hex strings', () => {
    const invalidCases = [
      'not-hex',
      '0xGGGG',
      'missing-0x-prefix',
      '0x with spaces',
      'plain-text',
    ]

    invalidCases.forEach((invalid) => {
      const result = getReferrerHex(invalid)
      expect(result).toBe(EMPTY_BYTES32)
    })
  })

  it('should pad short hex strings to 32 bytes', () => {
    const shortReferrer = '0xabc'
    const result = getReferrerHex(shortReferrer)

    expect(result.length).toBe(66)
    // Viem pads on the left, so 0xabc becomes 0x0000...0abc
    expect(result.endsWith('abc')).toBe(true)
    expect(result.startsWith('0x00')).toBe(true)
  })

  it('should reject hex strings longer than 32 bytes', () => {
    const tooLong = '0x' + 'a'.repeat(65) // 65 hex chars = > 32 bytes
    const result = getReferrerHex(tooLong)
    expect(result).toBe(EMPTY_BYTES32)
  })

  it('should handle exactly 32-byte hex strings', () => {
    const exactly32Bytes = '0x' + '1234567890abcdef'.repeat(4) // Exactly 64 hex chars
    const result = getReferrerHex(exactly32Bytes)

    expect(result).toBe(exactly32Bytes)
    expect(result.length).toBe(66)
  })
})

describe('resolveReferrerToHex', () => {
  const mockClient = {} as ClientWithEns

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should resolve ENS name to ETH address record and convert to hex', async () => {
    const ensName = 'vitalik.eth'
    const mockAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address

    vi.mocked(getAddressRecord).mockResolvedValueOnce({
      value: mockAddress,
      coin: 60, // ETH
    } as any)

    const result = await resolveReferrerToHex(mockClient, ensName)

    expect(result).toBeDefined()
    expect(result?.length).toBe(66) // 32 bytes = 64 hex chars + '0x'
    expect(result?.startsWith('0x')).toBe(true)
    expect(vi.mocked(getAddressRecord)).toHaveBeenCalledWith(mockClient, { name: ensName })
    // Should not call getOwner if address record exists
    expect(vi.mocked(getOwner)).not.toHaveBeenCalled()
  })

  it('should fall back to owner when no ETH address record exists', async () => {
    const ensName = 'test.eth'
    const mockOwnerAddress = '0x1234567890123456789012345678901234567890' as Address

    // No address record
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)

    // Has owner
    vi.mocked(getOwner).mockResolvedValueOnce({
      owner: mockOwnerAddress,
      ownershipLevel: 'registrar',
    } as any)

    const result = await resolveReferrerToHex(mockClient, ensName)

    expect(result).toBeDefined()
    expect(result?.length).toBe(66)
    expect(vi.mocked(getAddressRecord)).toHaveBeenCalledWith(mockClient, { name: ensName })
    expect(vi.mocked(getOwner)).toHaveBeenCalledWith(mockClient, { name: ensName })
  })

  it('should return null when ENS name has neither address record nor owner', async () => {
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)
    vi.mocked(getOwner).mockResolvedValueOnce(null)

    const result = await resolveReferrerToHex(mockClient, 'nonexistent.eth')
    expect(result).toBeNull()
  })

  it('should pass through valid hex addresses without resolution', async () => {
    const hexAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

    const result = await resolveReferrerToHex(mockClient, hexAddress)

    // Should not call ENS resolution functions for hex addresses
    expect(vi.mocked(getAddressRecord)).not.toHaveBeenCalled()
    expect(vi.mocked(getOwner)).not.toHaveBeenCalled()
    expect(result?.length).toBe(66)
  })

  it('should handle empty or undefined referrer', async () => {
    const result1 = await resolveReferrerToHex(mockClient, undefined)
    expect(result1).toBeNull()

    const result2 = await resolveReferrerToHex(mockClient, '')
    expect(result2).toBeNull()
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(getAddressRecord).mockRejectedValueOnce(new Error('Network error'))

    const result = await resolveReferrerToHex(mockClient, 'test.eth')
    expect(result).toBeNull()
  })

  it('should handle owner with no address', async () => {
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)
    vi.mocked(getOwner).mockResolvedValueOnce({
      owner: undefined,
      ownershipLevel: 'registrar',
    } as any)

    const result = await resolveReferrerToHex(mockClient, 'test.eth')
    expect(result).toBeNull()
  })
})
