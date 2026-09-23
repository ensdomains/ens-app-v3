import { getFeeHistory } from '@wagmi/core'
import { EstimateGasExecutionError, InvalidInputRpcError, RpcRequestError } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { createTransactionRequest } from '@app/transaction-flow/transaction'

import { createTransactionRequestQueryFn, getLargestMedianGasFee } from './query'

vi.mock('@getpara/rainbowkit', () => ({
  useConnectModal: () => ({
    openConnectModal: vi.fn(),
  }),
  connectorsForWallets: () => [() => {}],
}))

vi.mock('@app/transaction-flow/transaction', () => ({
  createTransactionRequest: vi.fn(),
}))

vi.mock('@wagmi/core', async () => {
  const originalModule = await vi.importActual('@wagmi/core')
  return {
    ...originalModule,
    getFeeHistory: vi.fn(),
  }
})

describe('getLargestMedianGasFee', () => {
  it('should return the largest median gas fee from the reward array', async () => {
    getFeeHistory.mockReturnValue({
      baseFeePerGas: [],
      gasUsedRatio: [],
      oldestBlock: 0n,
      reward: [
        [1000n], // Block 1 median fee
        [2000n], // Block 2 median fee
        [1500n], // Block 3 median fee
        [3000n], // Block 4 median fee
        [2500n], // Block 5 median fee
      ],
    })

    const result = await getLargestMedianGasFee()
    expect(result).toBe(3000n)
    expect(getFeeHistory).toHaveBeenCalledWith(expect.anything(), {
      blockCount: 5,
      rewardPercentiles: [50],
    })
  })

  it('should return the default max priority fee per gas if getFeeHistory fails', async () => {
    getFeeHistory.mockRejectedValue(new Error('Failed to get fee history'))
    const result = await getLargestMedianGasFee()
    expect(result).toBe(5000000000n)
  })

  it('should return the default max priority fee per gas if getFeeHistory returns an empty reward array', async () => {
    getFeeHistory.mockResolvedValue({
      baseFeePerGas: [],
      gasUsedRatio: [],
      oldestBlock: 0n,
      reward: [],
    })
    const result = await getLargestMedianGasFee()
    expect(result).toBe(5000000000n)
  })
})

describe('createTransactionRequestQueryFn', () => {
  const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

  const runQueryFn = () =>
    createTransactionRequestQueryFn({ getClient: () => ({}) } as never)({
      connectorClient: { account: { address } } as never,
      connections: [],
    })({
      queryKey: [{ name: 'registerName', data: {} }, 1, address],
    } as never)

  const makeRevert = (data: string) =>
    new EstimateGasExecutionError(
      new InvalidInputRpcError(
        new RpcRequestError({
          body: {},
          error: { code: -32000, message: 'execution reverted', data } as never,
          url: 'https://example.com',
        }),
      ),
      {},
    )

  it('should rethrow CommitmentTooNew so react-query retries it', async () => {
    const err = makeRevert(
      '0x74480cc9ae290bbaa3282c9bf6ccbc240c630120d38c5edda4089fe86e3afc462b7a6a060000000000000000000000000000000000000000000000000000000069d61c9f0000000000000000000000000000000000000000000000000000000069d61c93',
    )
    vi.mocked(createTransactionRequest).mockRejectedValueOnce(err)

    await expect(runQueryFn()).rejects.toBe(err)
  })

  it('should return any other failure as data', async () => {
    const err = makeRevert('0xdeadbeef')
    vi.mocked(createTransactionRequest).mockRejectedValueOnce(err)

    await expect(runQueryFn()).resolves.toEqual({ data: null, error: err })
  })

  it('should return a revert with null data as data rather than throwing a TypeError', async () => {
    const err = makeRevert(null as never)
    vi.mocked(createTransactionRequest).mockRejectedValueOnce(err)

    await expect(runQueryFn()).resolves.toEqual({ data: null, error: err })
  })
})
