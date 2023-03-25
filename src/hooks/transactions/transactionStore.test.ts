import type { PartialMockedFunction } from '@app/test-utils'

import { waitFor } from '@testing-library/react'
import { waitForTransaction } from '@wagmi/core'

import { createTransactionStore } from './transactionStore'

jest.mock('@wagmi/core', () => ({
  waitForTransaction: jest.fn(),
}))

const mockWaitForTransaction = waitForTransaction as unknown as jest.MockedFunction<
  PartialMockedFunction<typeof waitForTransaction>
>

const mockProvider = {
  getBlock: jest.fn(() => ({ timestamp: 1 })),
}

const setup = () => {
  const store = createTransactionStore({ provider: mockProvider as any })
  return store
}

describe('transactionStore', () => {
  it('should allow a repriced transaction', async () => {
    const store = setup()
    const transaction = {
      hash: '0x9b0f96d2f4132c90b6900476d869e6f68ec6f58af89cfc96bb9f86a9a45a74b5',
      action: 'test',
      key: 'test',
    }
    const newHash = '0x1f53b764ec83d9e77f6c62e6ab8fb9327daa6d78b6de61a69a8a80d77c9e4db4'

    mockWaitForTransaction.mockImplementation(async ({ onSpeedUp }) => {
      setTimeout(() => {
        onSpeedUp!({
          hash: newHash,
        } as any)
      }, 0)

      return {
        status: 1,
        blockHash: 'blockHash',
      }
    })

    store.addTransaction('account', 1, transaction)

    await waitFor(() => expect(store.getTransactions('account', 1)).toHaveLength(2))

    const transactions = store.getTransactions('account', 1)

    expect(mockProvider.getBlock).toHaveBeenCalledWith('blockHash')

    expect(transactions[1]).toStrictEqual({
      ...transaction,
      newHash,
      status: 'repriced',
      minedData: { status: 1, blockHash: 'blockHash', timestamp: 1000 },
    })
    expect(transactions[0]).toStrictEqual({
      ...transaction,
      hash: newHash,
      status: 'confirmed',
      minedData: { status: 1, blockHash: 'blockHash', timestamp: 1000 },
    })
  })
  it('should allow a cancelled transaction', async () => {
    const store = setup()
    const transaction = {
      hash: '0x9b0f96d2f4132c90b6900476d869e6f68ec6f58af89cfc96bb9f86a9a45a74b5',
      action: 'test',
      key: 'test',
    }
    const cancelledHash = '0x3d4d4de4ca4dc223319b82551f78a37e26d5e5d5a8a5d5c9c5a5f166a5c5b5b6'

    mockWaitForTransaction.mockImplementation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw {
        cancelled: true,
        replacement: {
          status: 1,
          blockHash: 'blockHash',
          hash: cancelledHash,
        },
      }
    })

    store.addTransaction('account', 1, transaction)

    await waitFor(() => expect(mockProvider.getBlock).toHaveBeenCalledWith('blockHash'))

    const transactions = store.getTransactions('account', 1)

    expect(transactions[0]).toStrictEqual({
      ...transaction,
      status: 'failed',
      minedData: { status: 0, hash: cancelledHash, blockHash: 'blockHash', timestamp: 1000 },
    })
  })
})
