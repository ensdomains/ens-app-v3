import { encodeFunctionData, labelhash, namehash } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { ClientWithEns, ConnectorClientWithEns } from '@app/types'

import extendSubnameExpiryTransaction from './extendSubnameExpiry'

const extendExpiryAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'labelhash',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: 'expiry',
        type: 'uint64',
      },
    ],
    name: 'extendExpiry',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

describe('extendSubnameExpiryTransaction', () => {
  const mockT = vi.fn((key: string, options?: any) => {
    if (key === 'transaction.extendNames.actionValue') return 'Extend'
    if (key === 'unit.years') return `${options.count} year`
    if (key === 'unit.months') return `${options.count} months`
    if (key === 'unit.days') return `${options.count} days`
    return key
  })

  it('should format display items correctly', () => {
    const result = extendSubnameExpiryTransaction.displayItems(
      {
        name: 'sub.test.eth',
        duration: 31536000,
        startDateTimestamp: 1640995200000,
        expiryTimestamp: 1672531200,
      },
      mockT,
    )

    expect(result).toEqual([
      {
        label: 'name',
        value: 'sub.test.eth',
        type: 'subname',
      },
      {
        label: 'action',
        value: 'Extend',
      },
      {
        label: 'duration',
        type: 'duration',
        value: {
          duration: '1 year',
          newExpiry: 'January 1, 2023',
        },
      },
    ])
  })

  it('should create name wrapper extendExpiry transaction data', async () => {
    const client = {
      chain: {
        contracts: {
          ensNameWrapper: {
            address: '0x1234567890123456789012345678901234567890',
          },
        },
      },
    } as unknown as ClientWithEns

    const result = await extendSubnameExpiryTransaction.transaction({
      client,
      connectorClient: {} as ConnectorClientWithEns,
      data: {
        name: 'sub.test.eth',
        duration: 31536000,
        startDateTimestamp: 1640995200000,
        expiryTimestamp: 1672531200,
      },
    })

    expect(result).toEqual({
      to: '0x1234567890123456789012345678901234567890',
      data: encodeFunctionData({
        abi: extendExpiryAbi,
        functionName: 'extendExpiry',
        args: [namehash('test.eth'), labelhash('sub'), 1672531200n],
      }),
    })
  })
})
