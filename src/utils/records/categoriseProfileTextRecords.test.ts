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
      agentRegistrations: [],
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
      agentRegistrations: [],
    })
  })

  it('should categorise agent-registration records correctly', () => {
    // ERC-7930 encoded address for mainnet (chain ID 1) with address 0x8004a169fb4a3325136eb29fa0ceb6d2e539a432
    const erc7930Hex = '0x00010000010114' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    const result = categoriseAndTransformTextRecords({
      texts: [{ key: `agent-registration[${erc7930Hex}][19151]`, value: '1' }],
      contentHash: undefined,
    })

    expect(result.agentRegistrations).toHaveLength(1)
    expect(result.agentRegistrations[0]).toMatchObject({
      agentId: '19151',
      chainId: 1,
      registryAddress: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
      iconKey: 'agent',
    })
    expect(result.other).toHaveLength(0)
  })

  it('should fall back to other for invalid agent-registration records', () => {
    const result = categoriseAndTransformTextRecords({
      texts: [{ key: 'agent-registration[invalid][123]', value: '1' }],
      contentHash: undefined,
    })

    expect(result.agentRegistrations).toHaveLength(0)
    expect(result.other).toHaveLength(1)
    expect(result.other[0].key).toBe('agent-registration[invalid][123]')
  })
})
