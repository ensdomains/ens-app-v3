import { describe, expect, it } from 'vitest'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { getReferrerHex } from './referrer'

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
