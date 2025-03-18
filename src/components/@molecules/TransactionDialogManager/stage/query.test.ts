import { getFeeHistory } from '@wagmi/core'
import { describe, expect, it, vi } from 'vitest'

import { getLargestMedianGasFee } from './query'

vi.mock('@getpara/rainbowkit', () => ({
  useConnectModal: () => ({
    openConnectModal: vi.fn(),
  }),
  connectorsForWallets: () => [() => {}],
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
