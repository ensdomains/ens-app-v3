import type { PartialMockedFunction } from '@app/test-utils'

import { getProvider } from '@wagmi/core'
import { BigNumber } from 'ethers'

import { fetchTxFromSafeTxHash } from '@app/utils/safe'

import { SafeTxExecutedError, waitForTransaction } from './waitForTransaction'

jest.mock('@app/utils/safe')

jest.mock('@wagmi/core', () => ({
  getProvider: jest.fn(),
  fetchBlockNumber: jest.fn(),
  fetchTransaction: jest.fn(),
}))

const mockGetProvider = getProvider as unknown as jest.MockedFunction<
  PartialMockedFunction<typeof getProvider>
>

const mockFetchTxFromSafeTxHash = fetchTxFromSafeTxHash as unknown as jest.MockedFunctionDeep<
  typeof fetchTxFromSafeTxHash
>

const mockWaitForTransaction = jest.fn()
const mockCall = jest.fn()
const mockGetTransactionReceipt = jest.fn()
const mockGetBlockNumber = jest.fn()

mockGetProvider.mockReturnValue({
  network: {
    chainId: 1,
  },
  _waitForTransaction: mockWaitForTransaction,
  call: mockCall,
  getTransactionReceipt: mockGetTransactionReceipt,
  getBlockNumber: mockGetBlockNumber,
})

describe('waitForTransaction', () => {
  it('should wait for standard transaction', async () => {
    mockWaitForTransaction.mockResolvedValueOnce({
      status: 1,
      transactionHash: 'test',
    })

    const result = await waitForTransaction({
      hash: '0xtest',
    })

    expect(result).toStrictEqual({
      status: 1,
      transactionHash: 'test',
    })
  })
  it('should allow a repriced transaction', async () => {
    mockWaitForTransaction.mockImplementationOnce(async () => {
      mockWaitForTransaction.mockImplementationOnce(async (hash: string) => {
        return {
          status: 1,
          transactionHash: hash,
        }
      })
      // equivalent to ethers repriced error
      throw new SafeTxExecutedError('repriced', { hash: 'newHash' })
    })

    const result = await waitForTransaction({
      hash: '0xtest',
    })

    expect(result).toStrictEqual({
      status: 1,
      transactionHash: 'newHash',
    })
  })
  it('should call onSpeedUp if transaction repriced', async () => {
    mockWaitForTransaction.mockImplementationOnce(async () => {
      mockWaitForTransaction.mockImplementationOnce(async (hash: string) => {
        return {
          status: 1,
          transactionHash: hash,
        }
      })
      // equivalent to ethers repriced error
      throw new SafeTxExecutedError('repriced', { hash: 'newHash' })
    })

    const onSpeedUp = jest.fn()

    await waitForTransaction({
      hash: '0xtest',
      onSpeedUp,
    })

    expect(onSpeedUp).toHaveBeenCalledWith({ hash: 'newHash' })
  })
  it('should throw other errors', async () => {
    mockWaitForTransaction.mockImplementationOnce(async () => {
      throw new Error('cancelled')
    })

    await expect(
      waitForTransaction({
        hash: '0xtest',
      }),
    ).rejects.toThrowError('cancelled')
  })
  it('should allow a SAFE transaction', async () => {
    const SAFE_TX_HASH = '0xf4b645e849800a5f8cf8437d02acfc2ef5d57d10b186b1495c6a38c80c4ebeea'
    const REAL_TX_HASH = '0x0d641a3dcbf8d7311f727a231be69c88d2f2f8478b718fd5692a0ec8df2b31cd'

    mockFetchTxFromSafeTxHash.mockResolvedValue({
      transactionHash: REAL_TX_HASH,
    })

    mockGetBlockNumber.mockResolvedValue(1)

    mockGetTransactionReceipt.mockResolvedValue({
      to: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
      from: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
      contractAddress: null,
      transactionIndex: 1,
      gasUsed: BigNumber.from('21000'),
      logsBloom: '0x00',
      blockHash: '0x5c3d86723f063c1e5fb6319244a9a9d5a5fb6865a28f2a9df2ccee50a1a5f82a',
      transactionHash: REAL_TX_HASH,
      logs: [],
      blockNumber: BigNumber.from('1'),
      confirmations: 1,
      cumulativeGasUsed: BigNumber.from('21000'),
      byzantium: true,
      status: 1,
      type: 0,
      rawLogs: [],
    })

    mockWaitForTransaction.mockImplementation(async () => {
      return {
        status: 1,
        transactionHash: REAL_TX_HASH,
      }
    })

    const onSpeedUp = jest.fn()

    const result = await waitForTransaction({
      hash: SAFE_TX_HASH,
      isSafeTx: true,
      onSpeedUp,
    })

    expect(mockFetchTxFromSafeTxHash).toHaveBeenCalledWith({
      chainId: 1,
      safeTxHash: SAFE_TX_HASH,
    })

    expect(mockGetTransactionReceipt).toHaveBeenCalledWith(REAL_TX_HASH)

    expect(onSpeedUp).toHaveBeenCalledWith({ hash: REAL_TX_HASH })

    expect(mockWaitForTransaction).toHaveBeenCalledWith(REAL_TX_HASH, 1, 0, null)

    expect(result).toStrictEqual({
      status: 1,
      transactionHash: REAL_TX_HASH,
    })
  })
})
