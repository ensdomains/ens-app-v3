import type { Block, Hash } from 'viem'
import { getBlock } from 'viem/actions'

import { waitForTransaction } from '@app/hooks/transactions/waitForTransaction'
import { wagmiConfig } from '@app/utils/query/wagmi'

import { createTransactionListener } from './createTransactionListener'
import { getTransactionKey } from './key'
import { type UseTransactionStore } from './transactionStore'
import type { TransactionList } from './types'

const transactionRequestCache = new Map<string, Promise<void>>()
const blockRequestCache = new Map<Hash, Promise<Block>>()

const listenForTransaction = async (
  store: UseTransactionStore,
  transaction: TransactionList<'pending'>[number],
) => {
  const receipt = await waitForTransaction(wagmiConfig, {
    confirmations: 1,
    hash: transaction.currentHash,
    isSafeTx: transaction.transactionType === 'safe',
    chainId: transaction.chainId,
    onReplaced: (replacedTransaction) => {
      if (replacedTransaction.reason !== 'repriced') return
      store.getState().transaction.setHash(transaction, replacedTransaction.transaction.hash)
    },
  })

  const { status, blockHash } = receipt
  let blockRequest = blockRequestCache.get(blockHash)
  if (!blockRequest) {
    const client = wagmiConfig.getClient({ chainId: transaction.chainId })
    blockRequest = getBlock(client, { blockHash })
    blockRequestCache.set(blockHash, blockRequest)
  }

  // TODO(tate): figure out if timestamp is needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { timestamp: _ } = await blockRequest
  store.getState().transaction.setStatus(transaction, status)

  const transactionKey = getTransactionKey(transaction)
  transactionRequestCache.delete(transactionKey)
}

export const transactionReceiptListener = (store: UseTransactionStore) =>
  createTransactionListener(
    (s) => s.transaction.getByStatus('pending'),
    (pendingTransactions) => {
      for (const tx of pendingTransactions) {
        const transactionKey = getTransactionKey(tx)
        const existingRequest = transactionRequestCache.get(transactionKey)
        // eslint-disable-next-line no-continue
        if (existingRequest) continue

        const requestPromise = listenForTransaction(store, tx)
        transactionRequestCache.set(transactionKey, requestPromise)
      }
    },
  )
