import { type MockedFunctionDeep } from '@vitest/spy'
import { WaitForTransactionReceiptReturnType, type Transaction } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ClientWithEns, ConfigWithEns } from '@app/types'
import { fetchTxFromSafeTxHash } from '@app/utils/safe'

import { requestWithSafeOverride, waitForTransaction } from './waitForTransaction'

vi.mock('viem/actions')

vi.mock('@app/utils/safe')

const mockWaitForTransactionReceipt = waitForTransactionReceipt as MockedFunctionDeep<
  typeof waitForTransactionReceipt
>
const mockFetchTxFromSafeTxHash = fetchTxFromSafeTxHash as MockedFunctionDeep<
  typeof fetchTxFromSafeTxHash
>

const mockRequest = vi.fn()
const mockClient = {
  chain: {
    id: 1,
  },
  request: mockRequest,
} as unknown as ClientWithEns
const mockConfig = {
  getClient: () => mockClient,
} as unknown as ConfigWithEns

const mockTransactionReceiptData: WaitForTransactionReceiptReturnType = {
  blockHash: '0xblockhash',
  blockNumber: 1n,
  contractAddress: null,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1n,
  from: '0xfrom',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00',
  status: 'success',
  to: '0xto',
  transactionHash: '0xtest',
  transactionIndex: 1,
  type: 'legacy',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('waitForTransaction', () => {
  it('should wait for standard transaction', async () => {
    // @ts-ignore vi.fn is messing with types
    mockWaitForTransactionReceipt.mockResolvedValueOnce(mockTransactionReceiptData)

    const result = await waitForTransaction(mockConfig, {
      hash: '0xtest',
    })

    expect(result).toStrictEqual(mockTransactionReceiptData)
  })
  it('should pass onReplaced tx to waitForTransactionReceipt', async () => {
    mockWaitForTransactionReceipt.mockResolvedValueOnce(mockTransactionReceiptData)

    const onReplaced = vi.fn()

    await waitForTransaction(mockConfig, {
      hash: '0xtest',
      onReplaced,
    })

    expect(mockWaitForTransactionReceipt).toHaveBeenCalled()

    const onReplacedInternalFn = mockWaitForTransactionReceipt.mock.calls[0][1].onReplaced
    onReplacedInternalFn!({
      reason: 'replaced',
      transaction: {
        hash: '0xnewhash',
      } as unknown as Transaction,
      replacedTransaction: {} as unknown as Transaction,
      transactionReceipt: {} as unknown as WaitForTransactionReceiptReturnType,
    })

    expect(onReplaced).toHaveBeenCalledWith({
      reason: 'replaced',
      transactionHash: '0xnewhash',
    })
  })
})

describe('requestWithSafeOverride', () => {
  it('should allow a SAFE transaction', async () => {
    const SAFE_TX_HASH = '0xf4b645e849800a5f8cf8437d02acfc2ef5d57d10b186b1495c6a38c80c4ebeea'
    const REAL_TX_HASH = '0x0d641a3dcbf8d7311f727a231be69c88d2f2f8478b718fd5692a0ec8df2b31cd'

    mockFetchTxFromSafeTxHash.mockResolvedValue({
      transactionHash: REAL_TX_HASH,
    })

    const expectedResult = {
      ...mockTransactionReceiptData,
      transactionHash: REAL_TX_HASH,
      to: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
      from: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
    }

    mockRequest.mockResolvedValue(expectedResult)

    const result = await requestWithSafeOverride(mockClient, {
      method: 'eth_getTransactionReceipt',
      params: [SAFE_TX_HASH],
    })

    expect(mockFetchTxFromSafeTxHash).toHaveBeenCalledWith({
      chainId: 1,
      safeTxHash: SAFE_TX_HASH,
    })

    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_getTransactionReceipt',
      params: [REAL_TX_HASH],
    })

    expect(result).toStrictEqual(expectedResult)
  })
})
