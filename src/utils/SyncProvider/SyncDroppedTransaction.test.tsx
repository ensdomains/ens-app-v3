import { mockFunction, render } from '@app/test-utils'

import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { usePublicClient } from '@app/hooks/usePublicClient'
import { PublicClientWithChain } from '@app/types'

import {
  findDroppedTransactions,
  getAccountHistoryEndpoint,
  SyncDroppedTransaction,
} from './SyncDroppedTransaction'

const ADDRESS = '0x1234567890abcdef'

export const handlers = [
  rest.get(getAccountHistoryEndpoint(ADDRESS, 1), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          hash: '0xabc123',
          input: 'input',
          timeStamp: '1',
          nonce: 0,
        },
      ]),
    )
  }),
]

export const server = setupServer(...handlers)

jest.mock('@app/hooks/account/useAccountSafely')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/transactions/TransactionStoreContext')
jest.mock('@app/hooks/usePublicClient')

const mockUsePublicClient = mockFunction(usePublicClient)
const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseTransactionStore = mockFunction(useTransactionStore)

describe('SyncDroppedTransaction', () => {
  const mockPublicClient = { chain: { id: 1 } }
  const mockAddress = '0x1234567890abcdef'
  const mockTransactions = [{ hash: '0xabc123' as const }, { hash: '0xdef456' as const }]
  const mockStore = { test: 'store' }

  beforeEach(() => {
    mockUsePublicClient.mockReturnValue(mockPublicClient)
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUseRecentTransactions.mockReturnValue(mockTransactions)
    mockUseTransactionStore.mockReturnValue(mockStore as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setInterval with the correct arguments', () => {
    const mockDelay = 10000
    jest.spyOn(global, 'setInterval').mockImplementation((fn: any) => fn())

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
      const mockPublicClient = { chain: { id: 1 } } as PublicClientWithChain
      const mockTransactions: any[] = []
      const mockAddress = undefined
      const mockStore = undefined

      const result = await findDroppedTransactions(mockPublicClient, {
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
      const mockPublicClient = { chain: { id: 1 } } as PublicClientWithChain

      const result = await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { foundMinedTransaction: jest.fn() } as any
      const mockPublicClient = { chain: { id: 1 } } as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
        address: mockAddress,
        store: mockStore,
        transactions: mockTransactions,
      })
      expect(mockStore.foundMinedTransaction).toHaveBeenCalled()
    })
    it('should error if there is more than one transaction that could be a replacement', async () => {
      server.use(
        rest.get(getAccountHistoryEndpoint(ADDRESS, 1), (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
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
            ]),
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
      const mockStore = { setReplacedTransaction: jest.fn() } as any
      const mockPublicClient = { chain: { id: 1 } } as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { setReplacedTransaction: jest.fn() } as any
      const mockPublicClient = { chain: { id: 1 } } as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { foundTransaction: jest.fn() } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve({}),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { setFailedTransaction: jest.fn() } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve(null),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { updateRetries: jest.fn() } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve(null),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { setReplacedTransactionByNonce: jest.fn() } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve(null),
        getTransactionCount: () => Promise.resolve(1),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
        setReplacedTransactionByNonce: jest.fn(),
        setFailedTransaction: jest.fn(),
      } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve(null),
        getTransactionCount: () => Promise.resolve(3),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
      const mockStore = { setFailedTransaction: jest.fn() } as any
      const mockPublicClient = {
        chain: { id: 1 },
        getTransaction: () => Promise.resolve(null),
        getTransactionCount: () => Promise.resolve(1),
      } as unknown as PublicClientWithChain

      await findDroppedTransactions(mockPublicClient, {
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
    const mockStore = { setFailedTransaction: jest.fn() } as any
    const mockPublicClient = {
      chain: { id: 1 },
      getTransaction: () => Promise.resolve(null),
      getTransactionCount: () => Promise.resolve(1),
    } as unknown as PublicClientWithChain

    await findDroppedTransactions(mockPublicClient, {
      address: mockAddress,
      store: mockStore,
      transactions: mockTransactions,
    })
    expect(mockStore.setFailedTransaction).toHaveBeenCalled()
  })
})
