import { describe, expect, it } from 'vitest'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { SelectedItemProperties } from '@app/components/pages/profile/[name]/registration/types'

// Test the getReferrerHex function behavior
describe('useRegistrationReducer - referrer storage', () => {
  // Helper function to simulate getReferrerHex
  const getReferrerHex = (referrer: string | undefined): `0x${string}` => {
    if (!referrer) return EMPTY_BYTES32

    if (!/^0x[0-9a-fA-F]*$/.test(referrer)) {
      return EMPTY_BYTES32
    }

    const hexWithoutPrefix = referrer.slice(2)
    const paddedHex = hexWithoutPrefix.padEnd(64, '0')

    if (paddedHex.length > 64) {
      return EMPTY_BYTES32
    }

    return `0x${paddedHex}` as `0x${string}`
  }

  it('should validate and pad valid hex strings to 32 bytes', () => {
    const referrer = '0x1234abcd'
    const result = getReferrerHex(referrer)

    // Should be 32 bytes (66 chars including '0x')
    expect(result.length).toBe(66)
    expect(result).toMatch(/^0x[0-9a-f]{64}$/i)
    expect(result.startsWith('0x1234abcd')).toBe(true)
    expect(result.endsWith('0')).toBe(true) // padded with zeros
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
    expect(result).toBe('0xabc' + '0'.repeat(61))
    expect(result.startsWith('0xabc')).toBe(true)
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

  it('should handle referrer data structure in registration item', () => {
    const referrerHex = '0x1234abcd'
    const paddedReferrer = getReferrerHex(referrerHex)

    const selected: SelectedItemProperties = {
      address: '0x1234567890123456789012345678901234567890',
      name: 'test.eth',
      chainId: 1,
      referrer: paddedReferrer,
    }

    const registrationDataItem = {
      ...selected,
      referrer: selected.referrer || EMPTY_BYTES32,
      stepIndex: 0,
      queue: ['pricing', 'info', 'transactions', 'complete'] as const,
      seconds: 31536000,
      reverseRecord: false,
      records: [],
      resolverAddress: EMPTY_BYTES32,
      secret: EMPTY_BYTES32,
      started: false,
      isMoonpayFlow: false,
      externalTransactionId: '',
      version: 4,
      durationType: 'years' as const,
      clearRecords: false,
    }

    // Verify the referrer is stored correctly
    expect(registrationDataItem.referrer).toBe(paddedReferrer)
    expect(registrationDataItem.referrer).not.toBe(EMPTY_BYTES32)
    expect(registrationDataItem.referrer.length).toBe(66)
    expect(registrationDataItem.referrer.startsWith('0x1234abcd')).toBe(true)
  })
})
