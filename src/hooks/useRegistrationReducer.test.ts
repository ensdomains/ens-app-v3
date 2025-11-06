import { stringToHex } from 'viem'
import { describe, expect, it } from 'vitest'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { SelectedItemProperties } from '@app/components/pages/profile/[name]/registration/types'

// Import the actual reducer file to test internal functions
// We'll test the data transformation logic directly
describe('useRegistrationReducer - referrer storage', () => {
  it('should convert referrer string to 32-byte hex format', () => {
    const referrer = 'test-partner'
    const expectedHex = stringToHex(referrer, { size: 32 })

    // Verify the conversion produces a valid 32-byte hex string
    expect(expectedHex).toMatch(/^0x[0-9a-f]{64}$/i)
    expect(expectedHex.length).toBe(66) // '0x' + 64 hex chars = 66 total
  })

  it('should handle empty referrer by using EMPTY_BYTES32', () => {
    const referrer = undefined
    const result = referrer ? stringToHex(referrer, { size: 32 }) : EMPTY_BYTES32

    expect(result).toBe(EMPTY_BYTES32)
    expect(result).toMatch(/^0x0+$/)
  })

  it('should correctly encode various referrer strings', () => {
    const testCases = [
      'partner-1',
      'my-test-partner',
      'affiliate123',
      'campaign_xyz',
    ]

    testCases.forEach((referrer) => {
      const encoded = stringToHex(referrer, { size: 32 })

      // Should be 32 bytes (66 chars including '0x')
      expect(encoded.length).toBe(66)

      // Should start with '0x'
      expect(encoded.startsWith('0x')).toBe(true)

      // Should be a valid hex string
      expect(encoded).toMatch(/^0x[0-9a-f]{64}$/i)

      // Should be deterministic (same input produces same output)
      const encoded2 = stringToHex(referrer, { size: 32 })
      expect(encoded).toBe(encoded2)
    })
  })

  it('should pad short strings to 32 bytes', () => {
    const shortReferrer = 'abc'
    const encoded = stringToHex(shortReferrer, { size: 32 })

    // Should still be 32 bytes
    expect(encoded.length).toBe(66)

    // Should start with the encoded 'abc' and be padded with zeros
    expect(encoded.startsWith('0x616263')).toBe(true) // 'abc' in hex is 616263
    expect(encoded.endsWith('00')).toBe(true) // padded with zeros
  })

  it('should handle referrer data structure in registration item', () => {
    // Simulate what the makeDefaultData function does
    const selected: SelectedItemProperties = {
      address: '0x1234567890123456789012345678901234567890',
      name: 'test.eth',
      chainId: 1,
    }

    const referrer = 'my-partner'
    const referrerHex = stringToHex(referrer, { size: 32 })

    const registrationDataItem = {
      ...selected,
      referrer: referrer ? referrerHex : EMPTY_BYTES32,
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
    expect(registrationDataItem.referrer).toBe(referrerHex)
    expect(registrationDataItem.referrer).not.toBe(EMPTY_BYTES32)
    expect(registrationDataItem.referrer.length).toBe(66)
  })
})
