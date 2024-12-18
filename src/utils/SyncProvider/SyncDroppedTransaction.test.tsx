import { mockFunction, render } from '@app/test-utils'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { getTransaction, getTransactionCount } from 'viem/actions'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClient } from 'wagmi'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { ClientWithEns } from '@app/types'

import {
  findDroppedTransactions,
  getAccountHistoryEndpoint,
  SyncDroppedTransaction,
} from './SyncDroppedTransaction'

vi.mock('wagmi')
vi.mock('viem/actions')

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/transactions/useRecentTransactions')
vi.mock('@app/hooks/transactions/TransactionStoreContext')

const ADDRESS = '0x1234567890abcdef'

export const handlers = [
  http.get(getAccountHistoryEndpoint(ADDRESS, 1), () => {
    return HttpResponse.json([{ hash: '0xabc123', input: 'input', timeStamp: '1', nonce: 0 }], {
      status: 200,
    })
  }),
]

export const server = setupServer(...handlers)

const mockGetTransaction = mockFunction(getTransaction)
const mockGetTransactionCount = mockFunction(getTransactionCount)
const mockUseClient = mockFunction(useClient)
const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseTransactionStore = mockFunction(useTransactionStore)

describe('SyncDroppedTransaction', () => {
  const mockClient = { chain: { id: 1 } }
  const mockAddress = '0x1234567890abcdef'
  const mockTransactions = [{ hash: '0xabc123' as const }, { hash: '0xdef456' as const }]
  const mockStore = { test: 'store' }

  beforeEach(() => {
    mockUseClient.mockReturnValue(mockClient)
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUseRecentTransactions.mockReturnValue(mockTransactions)
    mockUseTransactionStore.mockReturnValue(mockStore as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call setInterval with the correct arguments', () => {
    const mockDelay = 10000
    vi.spyOn(global, 'setInterval').mockImplementation((fn: any) => fn())

    render(<SyncDroppedTransaction>Test</SyncDroppedTransaction>)

    expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), mockDelay)
  })
})

describe('getAccountHistoryEndpoint', () => {
  it('returns the correct endpoint for mainnet', () => {
    const address = '0x1234567890123456789012345678901234567890'
    const chainId = 1
    const expectedEndpoint =
      'https://etherscan-api.ens-cf.workers.dev/accountHistory?address=0x1234567890123456789012345678901234567890'

    expect(getAccountHistoryEndpoint(address, chainId)).toEqual(expectedEndpoint)
  })

  it('returns the correct endpoint for goerli', () => {
    const address = '0x1234567890123456789012345678901234567890'
    const chainId = 5
    const expectedEndpoint =
      'https://etherscan-api-goerli.ens-cf.workers.dev/accountHistory?address=0x1234567890123456789012345678901234567890'

    expect(getAccountHistoryEndpoint(address, chainId)).toEqual(expectedEndpoint)
  })

  it('returns an empty string for unknown chainIds', () => {
    const address = '0x1234567890123456789012345678901234567890'
    const chainId = 123

    expect(getAccountHistoryEndpoint(address, chainId)).toEqual('')
  })
})

describe('findDroppedTransactions', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(async () => {
    if (server && typeof server.close === 'function') {
      // Add a check to make sure server is defined and has a close method
      server.close()
    }
  })
  afterEach(() => server.resetHandlers())

  describe('searchingTransactions', () => {
    it('should exit early if there is no connected account', async () => {
      const mockClient = { chain: { id: 1 } } as ClientWithEns
      const mockTransactions: any[] = []
      const mockAddress = undefined
      const mockStore = undefined

      const result = await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })

      expect(result).toBeUndefined()
    })
    it('should exit early if there are no pendingTransaction or searchingTransactions', async () => {
      const mockTransactions = [
        {
          searchStatus: 'found',
          hash: '0xabc123',
        },
        {
          status: 'confirmed',
        },
      ] as any

      const mockAddress = '0x1234567890abcdef'
      const mockStore = {} as any
      const mockClient = { chain: { id: 1 } } as ClientWithEns

      const result = await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })

      expect(result).toBeUndefined()
    })

    it('should find a searching transaction once it has been mined', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          hash: '0xabc123',
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { foundMinedTransaction: vi.fn() } as any
      const mockClient = { chain: { id: 1 } } as ClientWithEns

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.foundMinedTransaction).toHaveBeenCalled()
    })
    it('should error if there is more than one transaction that could be a replacement', async () => {
      server.use(
        http.get(getAccountHistoryEndpoint(ADDRESS, 1), () => {
          return HttpResponse.json(
            [
              {
                hash: '0xabc123',
                input: 'input',
                timeStamp: '1',
              },
              {
                hash: '0xabc123',
                input: 'input',
                timeStamp: '1',
              },
            ],
            { status: 200 },
          )
        }),
      )
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'input',
          timestamp: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransaction: vi.fn() } as any
      const mockClient = { chain: { id: 1 } } as ClientWithEns

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setReplacedTransaction).not.toHaveBeenCalled()
    })
    it('should set replaced transaction if there is a unique candidate', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'input',
          timestamp: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransaction: vi.fn() } as any
      const mockClient = { chain: { id: 1 } } as ClientWithEns

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setReplacedTransaction).toHaveBeenCalled()
    })
    it('should try to find the searching transaction again as a failsafe if it was not found, was not a replacement etc', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { foundTransaction: vi.fn() } as any
      const mockClient = {
        chain: { id: 1 },
      } as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve({}))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.foundTransaction).toHaveBeenCalled()
    })
    it('should handle cancelled transactions', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setFailedTransaction: vi.fn() } as any
      const mockClient = {
        chain: { id: 1 },
      } as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve(null))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setFailedTransaction).toHaveBeenCalled()
    })
    it('should update the retries count if all else fails', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 2,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { updateRetries: vi.fn() } as any
      const mockClient = {
        chain: { id: 1 },
      } as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve(null))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.updateRetries).toHaveBeenCalled()
    })
  })

  describe('pendingTransactions', () => {
    it('should replace transaction if nonces match', async () => {
      const mockTransactions = [
        {
          searchStatus: 'found',
          status: 'pending',
          input: 'input',
          timestamp: 0,
          nonce: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransactionByNonce: vi.fn() } as any
      const mockClient = {
        chain: { id: 1 },
      } as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve(null))
      mockGetTransactionCount.mockImplementation(() => Promise.resolve(1))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setReplacedTransactionByNonce).toHaveBeenCalled()
    })

    it('should wait for etherscan history to update', async () => {
      const mockTransactions = [
        {
          searchStatus: 'found',
          status: 'pending',
          input: 'notReplacement',
          timestamp: 0,
          nonce: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = {
        setReplacedTransactionByNonce: vi.fn(),
        setFailedTransaction: vi.fn(),
      } as any
      const mockClient = {
        chain: { id: 1 },
      } as unknown as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve(null))
      mockGetTransactionCount.mockImplementation(() => Promise.resolve(3))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setReplacedTransactionByNonce).not.toHaveBeenCalled()
      expect(mockStore.setFailedTransaction).not.toHaveBeenCalled()
    })

    it('should set transaction as failed if it is not a replacement', async () => {
      const mockTransactions = [
        {
          searchStatus: 'found',
          status: 'pending',
          input: 'notReplacement',
          timestamp: 0,
          nonce: 0,
        },
      ] as any
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setFailedTransaction: vi.fn() } as any
      const mockClient = {
        chain: { id: 1 },
      } as ClientWithEns
      mockGetTransaction.mockImplementation(() => Promise.resolve(null))
      mockGetTransactionCount.mockImplementation(() => Promise.resolve(1))

      await findDroppedTransactions(mockClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.setFailedTransaction).toHaveBeenCalled()
    })
  })

  it('should fail a transaction if it is no longer in the mempool', async () => {
    const mockTransactions = [
      {
        searchStatus: 'found',
        status: 'pending',
        input: 'notReplacement',
        timestamp: 0,
        nonce: 1,
      },
    ] as any
    const mockAddress = '0x1234567890abcdef'
    const mockStore = { setFailedTransaction: vi.fn() } as any
    const mockClient = {
      chain: { id: 1 },
    } as ClientWithEns
    mockGetTransaction.mockImplementation(() => Promise.resolve(null))
    mockGetTransactionCount.mockImplementation(() => Promise.resolve(1))

    await findDroppedTransactions(mockClient, {
      address: mockAddress,
      store: mockStore,
      transactions: mockTransactions,
    })
    expect(mockStore.setFailedTransaction).toHaveBeenCalled()
  })
})
