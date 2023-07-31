import { render } from '@app/test-utils'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useProvider } from 'wagmi'

import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'

import {
  SyncDroppedTransaction,
  findDroppedTransactions,
  getAccountHistoryEndpoint,
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

jest.mock('wagmi')
jest.mock('@app/hooks/useAccountSafely')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/transactions/TransactionStoreContext')

describe('SyncDroppedTransaction', () => {
  const mockProvider = { test: 'provider' }
  const mockAddress = '0x1234567890abcdef'
  const mockTransactions = [{ hash: '0xabc123' }, { hash: '0xdef456' }]
  const mockStore = { test: 'store' }
  const mockChainId = 1

  beforeEach(() => {
    useProvider.mockReturnValue(mockProvider)
    useAccountSafely.mockReturnValue({ address: mockAddress })
    useRecentTransactions.mockReturnValue(mockTransactions)
    useTransactionStore.mockReturnValue(mockStore)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setInterval with the correct arguments', () => {
    const mockDelay = 10000
    jest.spyOn(global, 'setInterval').mockImplementation((fn) => fn())

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
      const mockTransactions = []
      const mockAddress = undefined
      const mockStore = undefined
      const mockChainId = undefined
      const mockProvider = undefined

      const result = await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )

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
      ]

      const mockAddress = '0x1234567890abcdef'
      const mockStore = {}
      const mockChainId = 1
      const mockProvider = {}

      const result = await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )

      expect(result).toBeUndefined()
    })

    it('should find a searching transaction once it has been mined', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          hash: '0xabc123',
        },
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { foundMinedTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { test: 'provider' }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
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
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { test: 'provider' }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
      expect(mockStore.setReplacedTransaction).not.toHaveBeenCalled()
    })
    it('should set replaced transaction if there is a unique candidate', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'input',
          timestamp: 0,
        },
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { test: 'provider' }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
      expect(mockStore.setReplacedTransaction).toHaveBeenCalled()
    })
    it('should try to find the searching transaction again as a failsafe if it was not found, was not a replacement etc', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 0,
        },
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { foundTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => ({}) }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
      expect(mockStore.foundTransaction).toHaveBeenCalled()
    })
    it('should handle cancelled transactions', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 0,
        },
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setFailedTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => null }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
      expect(mockStore.setFailedTransaction).toHaveBeenCalled()
    })
    it('should update the retries count if all else fails', async () => {
      const mockTransactions = [
        {
          searchStatus: 'searching',
          input: 'notReplacement',
          timestamp: 2,
        },
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { updateRetries: jest.fn() }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => null }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
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
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setReplacedTransactionByNonce: jest.fn() }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
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
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = {
        setReplacedTransactionByNonce: jest.fn(),
        setFailedTransaction: jest.fn(),
      }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => null, getTransactionCount: () => 3 }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
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
      ]
      const mockAddress = '0x1234567890abcdef'
      const mockStore = { setFailedTransaction: jest.fn() }
      const mockChainId = 1
      const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
      await findDroppedTransactions(
        mockTransactions,
        mockAddress,
        mockStore,
        mockChainId,
        mockProvider,
      )
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
    ]
    const mockAddress = '0x1234567890abcdef'
    const mockStore = { setFailedTransaction: jest.fn() }
    const mockChainId = 1
    const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
    await findDroppedTransactions(
      mockTransactions,
      mockAddress,
      mockStore,
      mockChainId,
      mockProvider,
    )
    expect(mockStore.setFailedTransaction).toHaveBeenCalled()
  })
})
