import { render } from '@app/test-utils'

import { useProvider } from 'wagmi'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useChainId } from '@app/hooks/useChainId'

import { findDroppedTransactions, getAccountHistoryEndpoint, SyncDroppedTransaction } from './SyncDroppedTransaction'

const ADDRESS = '0x1234567890abcdef'

export const handlers = [
    rest.get(getAccountHistoryEndpoint(ADDRESS, 1), (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({result : [{
                hash: '0xabc123',
                input: 'input',
                timeStamp: '1',
                nonce: 0,
            }]})
            )
    }),
  ]

export const server = setupServer(...handlers)

jest.mock('wagmi')
jest.mock('@app/hooks/useAccountSafely')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/transactions/TransactionStoreContext')
jest.mock('@app/hooks/useChainId')

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
    useChainId.mockReturnValue(mockChainId)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call findDroppedTransactions with the correct arguments', () => {
    const mockFindDroppedTransactions = jest.fn()
    jest.spyOn(global, 'setInterval').mockImplementation((fn) => fn())

    render(<SyncDroppedTransaction>Test</SyncDroppedTransaction>)

    expect(mockFindDroppedTransactions).toHaveBeenCalledWith(
      mockTransactions,
      mockAddress,
      mockStore,
      mockChainId,
      mockProvider,
    )
  })

  it('should call setInterval with the correct arguments', () => {
    const mockFindDroppedTransactions = jest.fn()
    const mockDelay = 10000
    jest.spyOn(global, 'setInterval').mockImplementation((fn) => fn())

    render(<SyncDroppedTransaction>Test</SyncDroppedTransaction>)

    expect(global.setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      mockDelay,
      expect.arrayContaining([
        mockAddress,
        mockChainId,
        mockStore,
        mockProvider,
        ...mockTransactions.map((x) => x.hash),
      ]),
    )
  })
})

describe('getAccountHistoryEndpoint', () => {
    it('returns the correct endpoint for mainnet', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const chainId = 1
      const expectedEndpoint =
        'https://api.etherscan.io/api?module=account&action=txlist&address=0x1234567890123456789012345678901234567890&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M'

      expect(getAccountHistoryEndpoint(address, chainId)).toEqual(expectedEndpoint)
    })

    it('returns the correct endpoint for goerli', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const chainId = 5
      const expectedEndpoint =
        'https://api-goerli.etherscan.io/api?module=account&action=txlist&address=0x1234567890123456789012345678901234567890&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M'

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
          // server.close()
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
        
            const result = await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
        
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
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
            expect(mockStore.foundMinedTransaction).toHaveBeenCalled()
        })
        it('should error if there are more than one transactions that could be a replacement', async () => {
            server.use(    
                rest.get(getAccountHistoryEndpoint(ADDRESS, 1), (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({result : [{
                        hash: '0xabc123',
                        input: 'input',
                        timeStamp: '1'
                    },
                    {
                        hash: '0xabc123',
                        input: 'input',
                        timeStamp: '1'
                    }
                ]})
                    )
            }))
            
        })
        it('should set replaced transaction if there is a unique candidate', async () => {
            const mockTransactions = [
                {
                    searchStatus: 'searching',
                    input: 'input',
                    timestamp: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { setReplacedTransaction: jest.fn() }
            const mockChainId = 1
            const mockProvider = { test: 'provider' }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
            expect(mockStore.setReplacedTransaction).toHaveBeenCalled()
        })
        it('should try to find the searching transaction again as a failsafe if it was not found, was not a replacement etc', async () => {
            const mockTransactions = [
                {
                    searchStatus: 'searching',
                    input: 'notReplacement',
                    timestamp: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { foundTransaction: jest.fn() }
            const mockChainId = 1
            const mockProvider = { getTransaction: () => ({}) }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
            expect(mockStore.foundTransaction).toHaveBeenCalled()
        })
        it('should update the retries count if all else fails', async () => {
            const mockTransactions = [
                {
                    searchStatus: 'searching',
                    input: 'notReplacement',
                    timestamp: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { updateRetries: jest.fn() }
            const mockChainId = 1
            const mockProvider = { getTransaction: () => null }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
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
                    nonce: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { setReplacedTransactionByNonce: jest.fn() }
            const mockChainId = 1
            const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
            expect(mockStore.setReplacedTransactionByNonce).toHaveBeenCalled()    
        })

        it('should wait for etherscan history to update', async () => {
            const mockTransactions = [
                {
                    searchStatus: 'found',
                    status: 'pending',
                    input: 'notReplacement',
                    timestamp: 0,
                    nonce: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { setReplacedTransactionByNonce: jest.fn(), setFailedTransaction: jest.fn() }
            const mockChainId = 1
            const mockProvider = { getTransaction: () => null, getTransactionCount: () => 3 }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
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
                    nonce: 0
                },
            ]
            const mockAddress = '0x1234567890abcdef'
            const mockStore = { setFailedTransaction: jest.fn() }
            const mockChainId = 1
            const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
            await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
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
                nonce: 1
            },
        ]
        const mockAddress = '0x1234567890abcdef'
        const mockStore = { setFailedTransaction: jest.fn() }
        const mockChainId = 1
        const mockProvider = { getTransaction: () => null, getTransactionCount: () => 1 }
        await findDroppedTransactions(mockTransactions, mockAddress, mockStore, mockChainId, mockProvider)
        expect(mockStore.setFailedTransaction).toHaveBeenCalled()
    })
  })