import { describe, expect, it, vi } from 'vitest'
import { getChainContractAddress } from 'viem'
import { readContract } from 'viem/actions'

import { ClientWithEns, ConfigWithEns } from '@app/types'

import { getDefaultReverseRegistryNameQueryFn } from './useDefaultReverseRegistryName'

vi.mock('viem/actions', () => ({
  readContract: vi.fn(),
}))

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem')
  return {
    ...actual,
    getChainContractAddress: vi.fn().mockReturnValue('0xDefaultReverseRegistrar'),
  }
})

const mockReadContract = vi.mocked(readContract)
const mockGetChainContractAddress = vi.mocked(getChainContractAddress)

const address = '0x1234567890123456789012345678901234567890'
const chainId = 1

const mockClient = {
  chain: {
    id: chainId,
  },
} as unknown as ClientWithEns

const mockConfig = {
  getClient: () => mockClient,
} as unknown as ConfigWithEns

describe('getDefaultReverseRegistryNameQueryFn', () => {
  it('should call readContract with correct parameters', async () => {
    mockReadContract.mockResolvedValueOnce('test.eth')

    await getDefaultReverseRegistryNameQueryFn(mockConfig)({
      queryKey: [{ address }, chainId, address, undefined, 'getDefaultReverseRegistryName'],
      meta: {} as any,
      signal: undefined as any,
    })

    expect(mockGetChainContractAddress).toHaveBeenCalledWith({
      chain: mockClient.chain,
      contract: 'ensDefaultReverseRegistrar',
    })
    expect(mockReadContract).toHaveBeenCalledWith(
      mockClient,
      expect.objectContaining({
        address: '0xDefaultReverseRegistrar',
        functionName: 'nameForAddr',
        args: [address],
      }),
    )
  })

  it('should return the name when it exists', async () => {
    mockReadContract.mockResolvedValueOnce('test.eth')

    const result = await getDefaultReverseRegistryNameQueryFn(mockConfig)({
      queryKey: [{ address }, chainId, address, undefined, 'getDefaultReverseRegistryName'],
      meta: {} as any,
      signal: undefined as any,
    })

    expect(result).toBe('test.eth')
  })

  it('should return null for empty string', async () => {
    mockReadContract.mockResolvedValueOnce('')

    const result = await getDefaultReverseRegistryNameQueryFn(mockConfig)({
      queryKey: [{ address }, chainId, address, undefined, 'getDefaultReverseRegistryName'],
      meta: {} as any,
      signal: undefined as any,
    })

    expect(result).toBeNull()
  })

  it('should return null when contract call fails', async () => {
    mockReadContract.mockRejectedValueOnce(new Error('Contract call failed'))

    const result = await getDefaultReverseRegistryNameQueryFn(mockConfig)({
      queryKey: [{ address }, chainId, address, undefined, 'getDefaultReverseRegistryName'],
      meta: {} as any,
      signal: undefined as any,
    })

    expect(result).toBeNull()
  })

  it('should throw error when address is not provided', async () => {
    await expect(
      getDefaultReverseRegistryNameQueryFn(mockConfig)({
        queryKey: [{ address: undefined }, chainId, undefined, undefined, 'getDefaultReverseRegistryName'],
        meta: {} as any,
        signal: undefined as any,
      }),
    ).rejects.toThrow('address is required')
  })
})
