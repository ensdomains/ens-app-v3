import { mockFunction } from '@app/test-utils'

import { waitFor } from '@testing-library/react'
import { PartiallyMockedFunction } from '@vitest/spy'
import { getBlock } from 'viem/actions'
import { describe, expect, it, vi } from 'vitest'

import { wagmiConfig } from '@app/utils/query/wagmi'

import {
  createTransactionStore,
  etherscanDataToMinedData,
  EtherscanMinedData,
  foundMinedTransaction,
  foundTransaction,
  setFailedTransaction,
  setReplacedTransaction,
  setReplacedTransactionByNonce,
  updateRetries,
} from './transactionStore'
import { waitForTransaction } from './waitForTransaction'

vi.mock('viem/actions')

vi.mock('./waitForTransaction', () => ({
  waitForTransaction: vi.fn(),
}))

const mockGetBlock = mockFunction(getBlock).mockImplementation(async () => ({ timestamp: 1 }))

const mockWaitForTransaction = waitForTransaction as unknown as PartiallyMockedFunction<
  typeof waitForTransaction
>

const setup = () => {
  const store = createTransactionStore(wagmiConfig)
  return store
}

const client = wagmiConfig.getClient()

type MockUpdateFn = (_account: any, _chainId: any, updateFn: (...args: any[]) => any) => void

describe('transactionStore', () => {
  it('should allow a repriced transaction', async () => {
    const store = setup()
    const transaction = {
      hash: '0x9b0f96d2f4132c90b6900476d869e6f68ec6f58af89cfc96bb9f86a9a45a74b5',
      action: 'test',
      key: 'test',
      searchRetries: 0,
    } as const
    const newHash = '0x1f53b764ec83d9e77f6c62e6ab8fb9327daa6d78b6de61a69a8a80d77c9e4db4'

    mockWaitForTransaction.mockImplementation(async (_config, { onReplaced }) => {
      setTimeout(() => {
        onReplaced!({
          reason: 'repriced',
          transactionHash: newHash,
        })
      }, 0)

      return {
        status: 'success',
        blockHash: '0xblockHash',
      }
    })

    store.addTransaction('account', 1, transaction)

    await waitFor(() => expect(store.getTransactions('account', 1)).toHaveLength(2))

    const transactions = store.getTransactions('account', 1)

    expect(mockGetBlock).toHaveBeenCalledWith(client, { blockHash: '0xblockHash' })

    expect(transactions[1]).toStrictEqual({
      ...transaction,
      newHash,
      status: 'repriced',
      minedData: { status: 'success', blockHash: '0xblockHash', timestamp: 1000 },
      searchRetries: 0,
      searchStatus: 'searching',
    })
    expect(transactions[0]).toStrictEqual({
      ...transaction,
      hash: newHash,
      isSafeTx: false,
      status: 'confirmed',
      minedData: { status: 'success', blockHash: '0xblockHash', timestamp: 1000 },
      searchRetries: 0,
      searchStatus: 'searching',
    })
  })
  it('should allow a cancelled transaction', async () => {
    const store = setup()
    const transaction = {
      hash: '0x9b0f96d2f4132c90b6900476d869e6f68ec6f58af89cfc96bb9f86a9a45a74b5',
      action: 'test',
      key: 'test',
      searchRetries: 0,
    } as const
    const cancelledHash = '0x3d4d4de4ca4dc223319b82551f78a37e26d5e5d5a8a5d5c9c5a5f166a5c5b5b6'

    mockWaitForTransaction.mockImplementation(async () => {
      return {
        status: 'reverted',
        blockHash: '0xblockHash',
        hash: cancelledHash,
      }
    })

    store.addTransaction('account', 1, transaction)

    await waitFor(() =>
      expect(mockGetBlock).toHaveBeenCalledWith(client, { blockHash: '0xblockHash' }),
    )

    const transactions = store.getTransactions('account', 1)

    expect(transactions[0]).toStrictEqual({
      ...transaction,
      status: 'failed',
      minedData: {
        status: 'reverted',
        hash: cancelledHash,
        blockHash: '0xblockHash',
        timestamp: 1000,
      },
      searchRetries: 0,
      searchStatus: 'searching',
    })
  })
})

describe('foundTransaction', () => {
  it('should update found transaction correctly', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1
    const nonce = 1

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    foundTransaction(mockUpdateTransactions)(account, chainId, transactionHash, nonce)
    expect(updateFnResult).toEqual([
      {
        hash: transactionHash,
        searchStatus: 'found',
        nonce,
      },
    ])
  })
})

describe('etherscanDataToMinedData', () => {
  it('should convert etherscan data to mined data', () => {
    const etherscanMinedData = {
      blockHash: '0x1234567890abcdef',
      blockNumber: '123456',
      confirmations: '10',
      contractAddress: '0x1234567890abcdef',
      cumulativeGasUsed: '100000',
      from: '0x1234567890abcdef',
      functionName: 'transfer',
      gas: '21000',
      gasPrice: '1000000000',
      gasUsed: '21000',
      hash: '0x1234567890abcdef',
      input: '0x',
      isError: '0',
      methodId: '0x',
      nonce: '1',
      timeStamp: '1630512000',
      to: '0x1234567890abcdef',
      transactionIndex: 0,
      txreceipt_status: '1',
      value: '1000000000000000000',
    }

    const expectedMinedData = {
      cumulativeGasUsed: BigInt(etherscanMinedData.cumulativeGasUsed),
      effectiveGasPrice: BigInt(etherscanMinedData.gasPrice),
      gasUsed: BigInt('21000'),
      timestamp: parseInt(etherscanMinedData.timeStamp, 10),
      blockNumber: 123456n,
      logsBloom: '0x',
      transactionHash: '0x',
      logs: [],
      type: 'legacy',
      status: 'success',
      blockHash: '0x1234567890abcdef',
      contractAddress: '0x1234567890abcdef',
      from: '0x1234567890abcdef',
      to: '0x1234567890abcdef',
      transactionIndex: 0,
    }

    expect(etherscanDataToMinedData(etherscanMinedData)).toEqual(expectedMinedData)
  })
})

describe('setReplacedTransaction', () => {
  it('should set replaced transaction correctly', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1
    const transactionInput = 'transactionInput'
    const mockMinedData: EtherscanMinedData = {
      blockHash: '0x1234567890abcdef',
      blockNumber: '1234567',
      confirmations: '10',
      contractAddress: '0x1234567890abcdef',
      cumulativeGasUsed: '100000',
      from: '0x1234567890abcdef',
      gas: '100000',
      gasPrice: '1000000000',
      gasUsed: '50000',
      hash: '0x1234567890abcdef',
      input: '0x1234567890abcdef',
      isError: '0',
      timeStamp: '1234567890',
      to: '0x1234567890abcdef',
      transactionIndex: 0,
      txreceipt_status: '1',
      value: '1000000000000000000',
      functionName: 'transfer',
      methodId: '0x',
      nonce: '1',
    }

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
        input: transactionInput,
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    setReplacedTransaction(mockUpdateTransactions)(
      account,
      chainId,
      transactionInput,
      mockMinedData,
    )
    expect(updateFnResult).toEqual([
      {
        minedData: etherscanDataToMinedData(mockMinedData),
        ...mockTransactions[0],
        status: 'confirmed',
        searchStatus: 'found',
      },
    ])
  })
})

describe('setReaplcedTransactionByNonce', () => {
  it('should set replaced transaction by nonce correctly', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1
    const transactionInput = 'transactionInput'
    const mockMinedData: EtherscanMinedData = {
      blockHash: '0x1234567890abcdef',
      blockNumber: '1234567',
      confirmations: '10',
      contractAddress: '0x1234567890abcdef',
      cumulativeGasUsed: '100000',
      from: '0x1234567890abcdef',
      gas: '100000',
      gasPrice: '1000000000',
      gasUsed: '50000',
      hash: '0x1234567890abcdef',
      input: '0x1234567890abcdef',
      isError: '0',
      nonce: '1',
      timeStamp: '1234567890',
      to: '0x1234567890abcdef',
      transactionIndex: 0,
      txreceipt_status: '1',
      value: '1000000000000000000',
      functionName: 'transfer',
      methodId: '0x',
    }

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
        input: transactionInput,
        nonce: 1,
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    setReplacedTransactionByNonce(mockUpdateTransactions)(
      account,
      chainId,
      transactionInput,
      mockMinedData,
    )
    expect(updateFnResult).toEqual([
      {
        minedData: etherscanDataToMinedData(mockMinedData),
        ...mockTransactions[0],
        status: 'confirmed',
        searchStatus: 'found',
      },
    ])
  })
})

describe('foundMinedTranasction', () => {
  it('should update found mined transaction correctly and update the transaction status to confirmed', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1
    const transactionInput = 'transactionInput'
    const mockMinedData: EtherscanMinedData = {
      blockHash: '0x1234567890abcdef',
      blockNumber: '1234567',
      confirmations: '10',
      contractAddress: '0x1234567890abcdef',
      cumulativeGasUsed: '100000',
      from: '0x1234567890abcdef',
      gas: '100000',
      gasPrice: '1000000000',
      gasUsed: '50000',
      hash: '0x1234567890abcdef',
      input: '0x1234567890abcdef',
      isError: '0',
      nonce: '1',
      timeStamp: '1234567890',
      to: '0x1234567890abcdef',
      transactionIndex: 0,
      txreceipt_status: '1',
      value: '1000000000000000000',
      functionName: 'transfer',
      methodId: '0x',
    }

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
        input: transactionInput,
        nonce: 1,
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    foundMinedTransaction(mockUpdateTransactions)(account, chainId, transactionHash, mockMinedData)
    expect(updateFnResult).toEqual([
      {
        ...mockTransactions[0],
        minedData: etherscanDataToMinedData(mockMinedData),
        searchStatus: 'found',
        status: 'confirmed',
      },
    ])
  })
})

describe('updateRetries', () => {
  it('should update retries correctly', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
        searchRetries: 0,
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    updateRetries(mockUpdateTransactions)(account, chainId, transactionHash)
    expect(updateFnResult).toEqual([
      {
        hash: transactionHash,
        searchStatus: 'pending',
        searchRetries: 1,
      },
    ])
  })
})

describe('setFailedTransaction', () => {
  it('should set failed transaction correctly', () => {
    const transactionHash = 'hash'
    const account = 'account'
    const chainId = 1

    const mockTransactions = [
      {
        hash: transactionHash,
        searchStatus: 'pending',
        searchRetries: 0,
      },
    ]

    let updateFnResult
    const mockUpdateTransactions: MockUpdateFn = (_account, _chainId, updateFn) => {
      updateFnResult = updateFn(mockTransactions)
    }
    setFailedTransaction(mockUpdateTransactions)(account, chainId, transactionHash)
    expect(updateFnResult).toEqual([
      {
        hash: transactionHash,
        status: 'failed',
        searchStatus: 'found',
        searchRetries: 0,
      },
    ])
  })
})
