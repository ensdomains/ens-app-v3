/* eslint-disable no-promise-executor-return */
import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { getBlock, getTransactionReceipt, readContract } from 'viem/actions'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount, useBlockNumber, useChainId, useConfig, usePublicClient } from 'wagmi'

import { useChainName } from '@app/hooks/chain/useChainName'
import { useInvalidateOnBlock } from '@app/hooks/chain/useInvalidateOnBlock'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { useExistingCommitment } from '../useExistingCommitment'
import { getBlockMetadataByTimestamp } from './getBlockMetadataByTimestamp'

vi.mock('@app/hooks/chain/useChainName')
vi.mock('@app/hooks/transactions/useAddRecentTransaction')
vi.mock('@app/transaction-flow/TransactionFlowProvider')
vi.mock('@app/hooks/chain/useInvalidateOnBlock')
vi.mock('@app/hooks/useIsSafeApp')
vi.mock('wagmi')
vi.mock('viem/actions')
vi.mock('../utils/getBlockMetadataByTimestamp')
vi.mock('@ensdomains/ensjs/contracts', () => ({
  ethRegistrarControllerCommitSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commit',
      outputs: [],
      type: 'function',
    },
  ],
  ethRegistrarControllerCommitmentsSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commitments',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
  legacyEthRegistrarControllerCommitSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commit',
      outputs: [],
      type: 'function',
    },
  ],
  legacyEthRegistrarControllerCommitmentsSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commitments',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
  ethRegistrarControllerErrors: [],
  ethRegistrarControllerABI: [],
  ethRegistrarControllerInterface: {},
  legacyEthRegistrarControllerABI: [],
  legacyEthRegistrarControllerInterface: {},
  nameWrapperErrors: [],
  nameWrapperABI: [],
  nameWrapperInterface: {},
  nameWrapperCommitSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commit',
      outputs: [],
      type: 'function',
    },
  ],
  nameWrapperCommitmentsSnippet: [
    {
      inputs: [{ name: 'commitment', type: 'bytes32' }],
      name: 'commitments',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
  getChainContractAddress: ({ client, contract }: { client: any; contract: string }) =>
    client.chain.contracts[contract].address,
  __esModule: true,
  default: {},
}))

const mockUseChainName = mockFunction(useChainName)
const mockUseAddRecentTransaction = mockFunction(useAddRecentTransaction)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUsePublicClient = mockFunction(usePublicClient)
const mockUseAccount = mockFunction(useAccount)
const mockUseConfig = mockFunction(useConfig)
const mockUseChainId = mockFunction(useChainId)
const mockUseBlockNumber = mockFunction(useBlockNumber)
const mockUseInvalidateOnBlock = mockFunction(useInvalidateOnBlock)
const mockUseIsSafeApp = mockFunction(useIsSafeApp)
const mockReadContract = mockFunction(readContract)
const mockGetBlock = mockFunction(getBlock)
const mockGetTransactionReceipt = mockFunction(getTransactionReceipt)
const mockGetBlockMetadataByTimestamp = mockFunction(getBlockMetadataByTimestamp)

describe('useExistingCommitment', () => {
  const mockCommitment = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  const mockCommitKey = 'commit-test-0xaddress'
  const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const mockTime = 1000n
  const mockMaxAge = 300n // 5 minutes in seconds

  const mockClient = {
    request: vi.fn(),
    chain: {
      contracts: {
        ensEthRegistrarController: { address: '0xcontroller' },
        legacyEthRegistrarController: { address: '0xlegacycontroller' },
        multicall3: { address: '0xmulticall' },
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseChainName.mockReturnValue('mainnet')
    mockUseAddRecentTransaction.mockReturnValue(vi.fn())
    mockUseTransactionFlow.mockReturnValue({
      setTransactionHashFromUpdate: vi.fn(),
    })
    mockUsePublicClient.mockReturnValue(mockClient)
    mockUseAccount.mockReturnValue({ address: mockAddress })
    mockUseChainId.mockReturnValue(1)
    mockUseConfig.mockReturnValue({
      blockExplorers: {
        default: {
          name: 'Etherscan',
          url: 'https://etherscan.io',
          apiUrl: 'https://api.etherscan.io/api',
        },
      },
      getClient: () => mockClient,
      _isEns: true,
    })
    mockUseBlockNumber.mockReturnValue({ data: 1234n })
    mockUseInvalidateOnBlock.mockReturnValue({ data: undefined })
    mockUseIsSafeApp.mockReturnValue({ data: false, isLoading: false })
  })

  describe('No Existing Commitment', () => {
    it('should return null when no commitment exists', async () => {
      mockReadContract.mockResolvedValueOnce(0n) // commitment timestamp

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toBeNull()
      })
    })
  })

  describe('Valid Commitment', () => {
    it('should return commitmentExists for valid recent commitment', async () => {
      mockReadContract
        .mockResolvedValueOnce(mockTime) // commitment timestamp
        .mockResolvedValueOnce(mockMaxAge) // max age
        .mockResolvedValueOnce(mockTime + 30n) // current block timestamp (30s after commitment)

      mockGetBlockMetadataByTimestamp.mockResolvedValueOnce({
        ok: false,
      })

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          status: 'commitmentExists',
          timestamp: Number(mockTime),
        })
      })
    })

    it('should verify commitment', async () => {
      mockReadContract
        .mockResolvedValueOnce(mockTime) // commitment timestamp
        .mockResolvedValueOnce(mockMaxAge) // max age
        .mockResolvedValueOnce(mockTime + 30n) // current block timestamp (30s after commitment)

      mockGetBlockMetadataByTimestamp.mockResolvedValueOnce({
        ok: false,
      })

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          status: 'commitmentExists',
          timestamp: Number(mockTime),
        })
      })

      // Verify it used the correct contract address
      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          address: '0xcontroller',
        }),
      )

      // Verify it called the correct contract functions
      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'commitments',
          args: [mockCommitment],
        }),
      )

      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'maxCommitmentAge',
        }),
      )

      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'getCurrentBlockTimestamp',
        }),
      )
    })
  })

  describe('Expired Commitment', () => {
    it('should return commitmentExpired for old commitment', async () => {
      mockReadContract
        .mockResolvedValueOnce(mockTime) // commitment timestamp
        .mockResolvedValueOnce(mockMaxAge) // max age
        .mockResolvedValueOnce(mockTime + mockMaxAge + 1n) // current block timestamp (past max age)

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          status: 'commitmentExpired',
          timestamp: Number(mockTime),
        })
      })
    })
  })

  describe('Legacy Commitment', () => {
    it('should handle legacy commitment check', async () => {
      mockReadContract
        .mockResolvedValueOnce(mockTime) // commitment timestamp
        .mockResolvedValueOnce(mockMaxAge) // max age
        .mockResolvedValueOnce(mockTime + 30n) // current block timestamp

      mockGetBlockMetadataByTimestamp.mockResolvedValueOnce({
        ok: false,
      })

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: true,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          status: 'commitmentExists',
          timestamp: Number(mockTime),
        })
      })

      // Verify it used legacy controller address
      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          address: '0xlegacycontroller',
        }),
      )
    })
  })

  describe('Wrapped Commitment', () => {
    it('should verify wrapped commitment functionality', async () => {
      mockReadContract
        .mockResolvedValueOnce(mockTime) // commitment timestamp
        .mockResolvedValueOnce(mockMaxAge) // max age
        .mockResolvedValueOnce(mockTime + 30n) // current block timestamp (30s after commitment)

      mockGetBlockMetadataByTimestamp.mockResolvedValueOnce({
        ok: false,
      })

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
          isWrappedCommitment: true,
        }),
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          status: 'commitmentExists',
          timestamp: Number(mockTime),
        })
      })

      // Verify it used the correct contract address
      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          address: '0xcontroller',
        }),
      )

      // Verify it called the correct contract functions
      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'commitments',
          args: [mockCommitment],
        }),
      )

      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'maxCommitmentAge',
        }),
      )

      expect(mockReadContract).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          functionName: 'getCurrentBlockTimestamp',
        }),
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle contract read errors', async () => {
      mockReadContract.mockRejectedValueOnce(new Error('Contract error'))

      const { result } = renderHook(() =>
        useExistingCommitment({
          commitment: mockCommitment,
          commitKey: mockCommitKey,
          isLegacyCommit: false,
          scopeKey: mockAddress,
        }),
      )

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })
    })
  })
})
