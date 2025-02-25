/* eslint-disable no-plusplus */

/* eslint-disable @typescript-eslint/no-use-before-define */
// this is taken from rainbowkit
import { Address, Block, Hash, Hex } from 'viem'
import { getBlock } from 'viem/actions'

import { SupportedChain } from '@app/constants/chains'
import { ConfigWithEns, MinedData } from '@app/types'
import { parse, stringify } from '@app/utils/query/persist'

import { waitForTransaction } from './waitForTransaction'

const storageKey = 'transaction-data'

export type TransactionStatus =
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'repriced'
  | 'unknown'
  | 'searching'

interface BaseTransaction {
  hash: Hash
  action: string
  key?: string
  description?: string
  isSafeTx?: boolean
  status: TransactionStatus
  minedData?: MinedData
  newHash?: Hash
  nonce?: number
  searchRetries: number
  searchStatus?: 'searching' | 'found'
  input?: Hex
  timestamp?: number
}

interface SearchingTransaction extends BaseTransaction {
  status: 'searching'
  minedData?: never
  nonce?: never
}

interface PendingTransaction extends BaseTransaction {
  status: 'pending'
  minedData?: never
}

interface MinedTransaction extends BaseTransaction {
  status: 'confirmed' | 'failed'
  minedData?: MinedData
}

interface RepricedTransaction extends BaseTransaction {
  status: 'repriced'
  newHash: Hash
}

export interface EtherscanMinedData {
  blockHash: string
  blockNumber: string
  confirmations: string
  contractAddress: string
  cumulativeGasUsed: string
  from: string
  functionName: string
  gas: string
  gasPrice: string
  gasUsed: string
  hash: string
  input: string
  isError: string
  methodId: string
  nonce: string
  timeStamp: string
  to: string
  transactionIndex: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  txreceipt_status: string
  value: string
}

export type Transaction =
  | PendingTransaction
  | MinedTransaction
  | RepricedTransaction
  | SearchingTransaction

export type NewTransaction = Omit<Transaction, 'status' | 'minedData'> & {
  input?: Hex
  timestamp?: number
}

type Data = Record<string, Record<number, Transaction[] | undefined>>

function safeParseJsonData(string: string | null): Data {
  try {
    const value = string ? parse<Data>(string) : {}
    return typeof value === 'object' ? value : {}
  } catch (err) {
    return {}
  }
}

function loadData(): Data {
  return safeParseJsonData(
    typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null,
  )
}

export function etherscanDataToMinedData(etherscanMinedData: EtherscanMinedData): MinedData {
  return {
    effectiveGasPrice: BigInt(etherscanMinedData.gasPrice),
    cumulativeGasUsed: BigInt(etherscanMinedData.cumulativeGasUsed),
    gasUsed: BigInt(etherscanMinedData.gasUsed),
    timestamp: parseInt(etherscanMinedData.timeStamp, 10),
    blockNumber: BigInt(etherscanMinedData.blockNumber),
    logsBloom: '0x',
    transactionHash: '0x',
    logs: [],
    type: 'legacy',
    status: etherscanMinedData.txreceipt_status === '1' ? 'success' : 'reverted',
    blockHash: etherscanMinedData.blockHash as Hash,
    contractAddress: etherscanMinedData.contractAddress as Address | null,
    from: etherscanMinedData.from as Address,
    to: etherscanMinedData.to as Address,
    transactionIndex: etherscanMinedData.transactionIndex,
  }
}

const transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/

function validateTransaction(transaction: NewTransaction): string[] {
  const errors: string[] = []

  if (!transactionHashRegex.test(transaction.hash)) {
    errors.push('Invalid transaction hash')
  }

  if (typeof transaction.action !== 'string') {
    errors.push('Transaction must have an action')
  }

  return errors
}

export const foundTransaction =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (account: string, chainId: SupportedChain['id'], hash: string, nonce: number): void => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) =>
        transaction.hash === hash
          ? ({
              ...transaction,
              nonce,
              searchStatus: 'found',
            } as Transaction)
          : transaction,
      )
    })
  }

export const setReplacedTransaction =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (
    account: string,
    chainId: SupportedChain['id'],
    input: string,
    minedData: EtherscanMinedData,
  ) => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) => {
        return transaction.input === input
          ? ({
              ...transaction,
              minedData: etherscanDataToMinedData(minedData),
              status: 'confirmed',
              searchStatus: 'found',
            } as Transaction)
          : transaction
      })
    })
  }

export const setReplacedTransactionByNonce =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (
    account: string,
    chainId: SupportedChain['id'],
    input: string,
    minedData: EtherscanMinedData,
  ) => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) =>
        transaction.input === input && transaction.nonce === parseInt(minedData.nonce, 10)
          ? ({
              ...transaction,
              minedData: etherscanDataToMinedData(minedData),
              status: 'confirmed',
              searchStatus: 'found',
            } as Transaction)
          : transaction,
      )
    })
  }

export const foundMinedTransaction =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (account: string, chainId: SupportedChain['id'], hash: string, minedData: EtherscanMinedData) => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) =>
        transaction.hash === hash
          ? ({
              ...transaction,
              minedData: etherscanDataToMinedData(minedData),
              searchStatus: 'found',
              status: parseInt(minedData.isError) === 1 ? 'failed' : 'confirmed',
            } as Transaction)
          : transaction,
      )
    })
  }

export const updateRetries =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (account: string, chainId: SupportedChain['id'], hash: string) => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) =>
        transaction.hash === hash
          ? ({
              ...transaction,
              searchRetries: transaction.searchRetries + 1,
            } as Transaction)
          : transaction,
      )
    })
  }

export const setFailedTransaction =
  (
    updateTransactions: (
      account: string,
      chainId: SupportedChain['id'],
      updateFn: (transactions: Transaction[]) => Transaction[],
    ) => void,
  ) =>
  (account: string, chainId: SupportedChain['id'], hash: string) => {
    updateTransactions(account, chainId, (transactions: Transaction[]) => {
      return transactions.map((transaction) =>
        transaction.hash === hash
          ? ({
              ...transaction,
              status: 'failed',
              searchStatus: 'found',
            } as Transaction)
          : transaction,
      )
    })
  }

export function createTransactionStore(config_: ConfigWithEns) {
  let config: ConfigWithEns = config_
  let data: Data = loadData()

  const listeners: Set<() => void> = new Set()
  const transactionRequestCache: Map<string, Promise<void>> = new Map()
  const blockRequestCache: Map<string, Promise<Block>> = new Map()

  function setConfig(newConfig: ConfigWithEns) {
    config = newConfig
  }

  function getTransactions(account: string, chainId: SupportedChain['id']): Transaction[] {
    return data[account]?.[chainId] ?? []
  }

  function getCurrentTransactionHash(
    account: string,
    chainId: SupportedChain['id'],
    hash: string,
  ): string {
    const allTransactions = getTransactions(account, chainId)
    const currentTransaction = allTransactions.find((transaction) => transaction.hash === hash)
    if (currentTransaction && currentTransaction.status === 'repriced')
      return getCurrentTransactionHash(account, chainId, currentTransaction.newHash)
    return hash
  }

  function addTransaction(
    account: string,
    chainId: SupportedChain['id'],
    transaction: NewTransaction,
  ): void {
    const errors = validateTransaction(transaction)

    if (errors.length > 0) {
      throw new Error(['Unable to add transaction', ...errors].join('\n'))
    }

    updateTransactions(account, chainId, (transactions) => {
      return [
        { ...transaction, searchRetries: 0, searchStatus: 'searching', status: 'pending' },
        ...transactions.filter(({ hash }) => {
          // Omit any duplicate transactions
          return hash !== transaction.hash
        }),
      ]
    })
  }

  function clearTransactions(account: string, chainId: SupportedChain['id']): void {
    updateTransactions(account, chainId, () => {
      return []
    })
  }

  function setTransactionStatus(
    account: string,
    chainId: SupportedChain['id'],
    hash: string,
    status: 'confirmed' | 'failed',
    minedData: MinedData,
  ): void
  function setTransactionStatus(
    account: string,
    chainId: SupportedChain['id'],
    hash: string,
    status: 'repriced',
    newHash: string,
  ): void
  function setTransactionStatus(
    account: string,
    chainId: SupportedChain['id'],
    hash: string,
    status: 'confirmed' | 'failed' | 'repriced',
    minedData: MinedData | string,
  ): void {
    updateTransactions(account, chainId, (transactions) => {
      return transactions.map((transaction) =>
        transaction.hash === hash
          ? ({
              ...transaction,
              status,
              ...(status === 'repriced' ? { newHash: minedData } : { minedData }),
            } as Transaction)
          : transaction,
      )
    })
  }

  async function waitForPendingTransactions(
    account: string,
    chainId: SupportedChain['id'],
  ): Promise<void> {
    await Promise.all(
      getTransactions(account, chainId)
        .filter((transaction) => transaction.status === 'pending')
        .map(async (transaction) => {
          const { hash } = transaction

          const existingRequest = transactionRequestCache.get(hash)

          if (existingRequest) {
            return existingRequest
          }

          const requestPromise = waitForTransaction(config, {
            confirmations: 1,
            hash: hash as `0x${string}`,
            onReplaced: (response) => {
              if (response.reason === 'repriced') {
                setTransactionStatus(account, chainId, hash, 'repriced', response.transactionHash)
                addTransaction(account, chainId, {
                  ...transaction,
                  isSafeTx: false,
                  hash: response.transactionHash,
                })
                transactionRequestCache.set(response.transactionHash, requestPromise)
                transactionRequestCache.delete(hash)
              }
            },
            isSafeTx: transaction.isSafeTx,
          }).then(async (receipt) => {
            const { status, blockHash } = receipt
            let blockRequest = blockRequestCache.get(blockHash)
            if (!blockRequest) {
              const client = config.getClient({
                chainId,
              })
              blockRequest = getBlock(client, { blockHash })
              blockRequestCache.set(blockHash, blockRequest)
            }
            const { timestamp } = await blockRequest

            const hashOfRequest = getCurrentTransactionHash(account, chainId, hash)

            transactionRequestCache.delete(hashOfRequest)

            setTransactionStatus(
              account,
              chainId,
              hashOfRequest,
              status === 'reverted' ? 'failed' : 'confirmed',
              {
                ...receipt,
                timestamp: Number(timestamp) * 1000,
              },
            )
          })

          transactionRequestCache.set(hash, requestPromise)
          return requestPromise
        }),
    )
  }

  function updateTransactions(
    account: string,
    chainId: SupportedChain['id'],
    updateFn: (transactions: Transaction[]) => Transaction[],
  ): void {
    // Ensure we're always operating on the latest data in case we have
    // multiple instances/tabs/etc. since we write all data back to
    // local storage after updating
    data = loadData()

    data[account] = data[account] ?? {}

    let completedTransactionCount = 0
    const MAX_COMPLETED_TRANSACTIONS = 8
    const transactions = updateFn(data[account][chainId] ?? [])
      // Keep the list of completed transactions from growing indefinitely
      .filter(({ status }) => {
        return status === 'pending'
          ? true
          : completedTransactionCount++ <= MAX_COMPLETED_TRANSACTIONS
      })

    data[account][chainId] = transactions.length > 0 ? transactions : undefined

    persistData()
    notifyListeners()
    waitForPendingTransactions(account, chainId)
  }

  function persistData(): void {
    localStorage.setItem(storageKey, stringify(data))
  }

  function notifyListeners(): void {
    listeners.forEach((listener) => listener())
  }

  function onChange(fn: () => void): () => void {
    listeners.add(fn)

    return () => {
      listeners.delete(fn)
    }
  }

  return {
    setConfig,
    addTransaction,
    clearTransactions,
    getTransactions,
    onChange,
    waitForPendingTransactions,
    setTransactionStatus,
    foundTransaction: foundTransaction(updateTransactions),
    foundMinedTransaction: foundMinedTransaction(updateTransactions),
    updateRetries: updateRetries(updateTransactions),
    setReplacedTransaction: setReplacedTransaction(updateTransactions),
    setFailedTransaction: setFailedTransaction(updateTransactions),
    setReplacedTransactionByNonce: setReplacedTransactionByNonce(updateTransactions),
  }
}

export type TransactionStore = ReturnType<typeof createTransactionStore>
