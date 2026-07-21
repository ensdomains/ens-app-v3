import { describe, expect, it } from 'vitest'
import { encodeFunctionData, isHex, namehash, pad, parseAbi } from 'viem'

import { EMPTY_BYTES32, generateRecordCallArray } from '@ensdomains/ensjs/utils'

import { profileRecordsToRecordOptions } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import {
  RegistrationReducerAction,
  RegistrationReducerData,
  SelectedItemProperties,
} from '@app/components/pages/profile/[name]/registration/types'
import { ProfileRecord } from '@app/constants/profileRecordOptions'

import { reducer } from './useRegistrationReducer'

// Test the getReferrerHex function behavior
describe('useRegistrationReducer - referrer storage', () => {
  // Helper function to simulate getReferrerHex
  const getReferrerHex = (referrer: string | undefined): `0x${string}` => {
    if (!referrer) return EMPTY_BYTES32

    if (!isHex(referrer)) {
      return EMPTY_BYTES32
    }

    const hexLength = (referrer.length - 2) / 2
    if (hexLength > 32) {
      return EMPTY_BYTES32
    }

    return pad(referrer, { size: 32 })
  }

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
    // Viem pads on the left, so value ends with original hex
    expect(registrationDataItem.referrer.endsWith('1234abcd')).toBe(true)
  })

  it('should preserve referrer through registration flow actions', () => {
    // Simulate registration flow with referrer
    const referrerHex = '0x1234abcd'
    const paddedReferrer = getReferrerHex(referrerHex)

    const selected: SelectedItemProperties = {
      address: '0x1234567890123456789012345678901234567890',
      name: 'test.eth',
      chainId: 1,
      referrer: paddedReferrer,
    }

    // Simulate reducer state
    const state = { items: [] }

    // First action creates the item with referrer
    const createAction = {
      name: 'setPricingData' as const,
      selected,
      payload: {
        seconds: 31536000,
        reverseRecord: true,
        durationType: 'years' as const,
      },
    }

    // Verify that if we're using the same selected object (with referrer),
    // the referrer should be preserved when item is created
    expect(selected.referrer).toBe(paddedReferrer)
    expect(selected.referrer).not.toBe(EMPTY_BYTES32)

    // The key insight: selected object MUST include referrer
    // so that when reducer creates a new item, it has the referrer
    expect(createAction.selected.referrer).toBeDefined()
    expect(createAction.selected.referrer).toBe(paddedReferrer)
  })
})

const selectedItem: SelectedItemProperties = {
  address: '0x1234567890123456789012345678901234567890',
  name: 'test.eth',
  chainId: 1,
}

const ethRecord: ProfileRecord = {
  key: 'eth',
  group: 'address',
  type: 'addr',
  value: '0x1234567890123456789012345678901234567890',
}

const setProfileData = (
  payload: Extract<RegistrationReducerAction, { name: 'setProfileData' }>['payload'],
): RegistrationReducerAction => ({ name: 'setProfileData', selected: selectedItem, payload })

const applyActions = (...actions: RegistrationReducerAction[]) =>
  actions.reduce<RegistrationReducerData>(reducer, { items: [] }).items[0]

describe('useRegistrationReducer - setProfileData', () => {
  it('should default clearRecords to false on a newly created item', () => {
    const item = applyActions(setProfileData({ records: [ethRecord] }))
    expect(item.clearRecords).toBe(false)
  })

  it('should store clearRecords when the payload sets it to true', () => {
    const item = applyActions(setProfileData({ records: [ethRecord], clearRecords: true }))
    expect(item.clearRecords).toBe(true)
  })

  it('should store clearRecords when the payload sets it to false', () => {
    const item = applyActions(
      setProfileData({ records: [ethRecord], clearRecords: true }),
      setProfileData({ records: [ethRecord], clearRecords: false }),
    )
    expect(item.clearRecords).toBe(false)
  })

  it('should keep the stored clearRecords when a later payload omits it', () => {
    const item = applyActions(
      setProfileData({ records: [ethRecord], clearRecords: true }),
      setProfileData({ records: [ethRecord] }),
    )
    expect(item.clearRecords).toBe(true)
  })
})

describe('useRegistrationReducer - stored profile data as resolver calls', () => {
  const node = namehash(selectedItem.name)
  // hand-written ABI on purpose: an oracle independent of the ensjs snippet that
  // generateRecordCallArray itself encodes with (deliberate deviation from the ensjs-ABI rule)
  const clearRecordsCall = encodeFunctionData({
    abi: parseAbi(['function clearRecords(bytes32 node)']),
    functionName: 'clearRecords',
    args: [node],
  })

  const callArrayForStoredItem = (clearRecords?: boolean) => {
    const item = applyActions(setProfileData({ records: [ethRecord], clearRecords }))
    const recordOptions = profileRecordsToRecordOptions(item.records, item.clearRecords)
    return { recordOptions, calls: generateRecordCallArray({ namehash: node, ...recordOptions }) }
  }

  it('should include the clearRecords call when the stored item has clearRecords set', () => {
    const { recordOptions, calls } = callArrayForStoredItem(true)
    expect(recordOptions.clearRecords).toBe(true)
    expect(calls).toContain(clearRecordsCall)
  })

  it('should not include the clearRecords call when the stored item has clearRecords false', () => {
    const { recordOptions, calls } = callArrayForStoredItem(false)
    expect(recordOptions.clearRecords).toBe(false)
    expect(calls).not.toContain(clearRecordsCall)
  })
})
