/* eslint-disable no-plusplus */

/* eslint-disable @typescript-eslint/no-use-before-define */
// this is taken from rainbowkit
import type { BaseProvider, Block, TransactionReceipt } from '@ethersproject/providers'
import { waitForTransaction } from '@wagmi/core'

import { MinedData } from '@app/types'

const storageKey = 'transaction-data'

type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'repriced'

interface BaseTransaction {
  hash: string
  action: string
  key?: string
  description?: string
  status: TransactionStatus
  minedData?: MinedData
  newHash?: string
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
  newHash: string
}

export type Transaction = PendingTransaction | MinedTransaction | RepricedTransaction

export type NewTransaction = Omit<Transaction, 'status' | 'minedData'>

type Data = Record<string, Record<number, Transaction[] | undefined>>

function safeParseJsonData(string: string | null): Data {
  try {
    const value = string ? JSON.parse(string) : {}
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

export function createTransactionStore({ provider: initialProvider }: { provider: BaseProvider }) {
  let data: Data = loadData()

  let provider = initialProvider
  const listeners: Set<() => void> = new Set()
  const transactionRequestCache: Map<string, Promise<void>> = new Map()
  const blockRequestCache: Map<string, Promise<Block>> = new Map()

  function setProvider(newProvider: BaseProvider): void {
    provider = newProvider
  }

  function getTransactions(account: string, chainId: number): Transaction[] {
    return data[account]?.[chainId] ?? []
  }

  function getCurrentTransactionHash(account: string, chainId: number, hash: string): string {
    const allTransactions = getTransactions(account, chainId)
    const currentTransaction = allTransactions.find((transaction) => transaction.hash === hash)
    if (currentTransaction && currentTransaction.status === 'repriced')
      return getCurrentTransactionHash(account, chainId, currentTransaction.newHash)
    return hash
  }

  function addTransaction(account: string, chainId: number, transaction: NewTransaction): void {
    const errors = validateTransaction(transaction)

    if (errors.length > 0) {
      throw new Error(['Unable to add transaction', ...errors].join('\n'))
    }

    updateTransactions(account, chainId, (transactions) => {
      return [
        { ...transaction, status: 'pending' },
        ...transactions.filter(({ hash }) => {
          // Omit any duplicate transactions
          return hash !== transaction.hash
        }),
      ]
    })
  }

  function clearTransactions(account: string, chainId: number): void {
    updateTransactions(account, chainId, () => {
      return []
    })
  }

  function setTransactionStatus(
    account: string,
    chainId: number,
    hash: string,
    status: 'confirmed' | 'failed',
    minedData: MinedData,
  ): void
  function setTransactionStatus(
    account: string,
    chainId: number,
    hash: string,
    status: 'repriced',
    newHash: string,
  ): void
  function setTransactionStatus(
    account: string,
    chainId: number,
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

  async function waitForPendingTransactions(account: string, chainId: number): Promise<void> {
    await Promise.all(
      getTransactions(account, chainId)
        .filter((transaction) => transaction.status === 'pending')
        .map(async (transaction) => {
          const { hash } = transaction

          const existingRequest = transactionRequestCache.get(hash)

          if (existingRequest) {
            return existingRequest
          }

          const requestPromise = waitForTransaction({
            confirmations: 1,
            hash: hash as `0x${string}`,
            onSpeedUp: (speedUpTransaction) => {
              setTransactionStatus(account, chainId, hash, 'repriced', speedUpTransaction.hash)
              addTransaction(account, chainId, {
                ...transaction,
                hash: speedUpTransaction.hash,
              })

              transactionRequestCache.set(speedUpTransaction.hash, requestPromise)
              transactionRequestCache.delete(hash)
            },
          })
            .catch((err) => {
              console.error('transaction error:', err)
              if (err.cancelled) {
                const replacement = err.replacement as TransactionReceipt
                return { ...replacement, status: 0 }
              }
              return err
            })
            .then(async (receipt) => {
              const { status, blockHash } = receipt
              let blockRequest = blockRequestCache.get(blockHash)
              if (!blockRequest) {
                blockRequest = provider.getBlock(blockHash)
                blockRequestCache.set(blockHash, blockRequest)
              }
              const { timestamp } = await blockRequest

              const hashOfRequest = getCurrentTransactionHash(account, chainId, hash)

              transactionRequestCache.delete(hashOfRequest)

              if (status === undefined) {
                if (receipt instanceof Error) {
                  setTransactionStatus(account, chainId, hashOfRequest, 'failed', {
                    timestamp: Date.now(),
                  } as MinedData)
                }
                return
              }

              setTransactionStatus(
                account,
                chainId,
                hashOfRequest,
                status === 0 ? 'failed' : 'confirmed',
                {
                  ...receipt,
                  timestamp: timestamp * 1000,
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
    chainId: number,
    updateFn: (transactions: Transaction[]) => Transaction[],
  ): void {
    // Ensure we're always operating on the latest data in case we have
    // multiple instances/tabs/etc. since we write all data back to
    // local storage after updating
    data = loadData()

    data[account] = data[account] ?? {}

    let completedTransactionCount = 0
    const MAX_COMPLETED_TRANSACTIONS = 10
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
    localStorage.setItem(storageKey, JSON.stringify(data))
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
    addTransaction,
    clearTransactions,
    getTransactions,
    onChange,
    setProvider,
    waitForPendingTransactions,
  }
}

export type TransactionStore = ReturnType<typeof createTransactionStore>
