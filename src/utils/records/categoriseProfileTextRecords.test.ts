import { describe, expect, it, vi } from 'vitest'

import { categoriseAndTransformTextRecords } from './categoriseProfileTextRecords'

describe('categoriseProfileTextRecords', () => {
  it('should return text records correctly categorised', () => {
    const result = categoriseAndTransformTextRecords({
      texts: [
        { key: 'com.twitter', value: 'name' },
        { key: 'other', value: 'value' },
        { key: 'description', value: 'description' },
      ],
      contentHash: 'ipfs://contenthash',
      appendVerificationProps: (record: any) => ({
        ...record,
        isVerified: true,
        verifiers: ['dentity'],
      }),
    })
    expect(result).toEqual({
      general: [{ key: 'description', value: 'description' }],
      accounts: [
        {
          key: 'com.twitter',
          normalisedKey: 'com.twitter',
          value: '@name',
          isVerified: true,
          verifiers: ['dentity'],
          iconKey: 'com.twitter',
        },
      ],
      other: [
        { key: 'other', value: 'value', type: 'text', iconKey: 'other' },
        {
          key: 'contenthash',
          value: 'ipfs://contenthash',
          type: 'contenthash',
          iconKey: 'contenthash',
        },
      ],
    })
  })

  it('should not return a contenthash record item if it is undefined', () => {
    const result = categoriseAndTransformTextRecords({
      texts: [
        { key: 'com.twitter', value: 'name' },
        { key: 'other', value: 'value' },
        { key: 'description', value: 'description' },
      ],
      contentHash: undefined,
      appendVerificationProps: (record: any) => ({
        ...record,
        isVerified: true,
        verifiers: ['dentity'],
      }),
    })
    expect(result).toEqual({
      general: [{ key: 'description', value: 'description' }],
      accounts: [
        {
          key: 'com.twitter',
          normalisedKey: 'com.twitter',
          value: '@name',
          isVerified: true,
          verifiers: ['dentity'],
          iconKey: 'com.twitter',
        },
      ],
      other: [{ key: 'other', value: 'value', type: 'text', iconKey: 'other' }],
    })
  })
})
