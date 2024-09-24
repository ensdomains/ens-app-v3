import type { Block, Hash } from 'viem'
import { getBlock } from 'viem/actions'

import { waitForTransaction } from '@app/hooks/transactions/waitForTransaction'
import { wagmiConfig } from '@app/utils/query/wagmi'

import { getTransactionKey } from '../key'
import type { StoredTransactionList } from '../slices/createTransactionSlice'
import type { UseTransactionManager } from '../transactionManager'
import { createTransactionListener } from './createTransactionListener'

const transactionRequestCache = new Map<string, Promise<void>>()
const blockRequestCache = new Map<Hash, Promise<Block>>()

const listenForTransaction = async (
  store: UseTransactionManager,
  transaction: StoredTransactionList<'pending'>[number],
) => {
  const receipt = await waitForTransaction(wagmiConfig, {
    confirmations: 1,
    hash: transaction.currentHash,
    isSafeTx: transaction.transactionType === 'safe',
    chainId: transaction.targetChainId,
    onReplaced: (replacedTransaction) => {
      if (replacedTransaction.reason !== 'repriced') return
      store.getState().setTransactionHash(transaction, replacedTransaction.transaction.hash)
    },
  })

  const { status, blockHash } = receipt
  let blockRequest = blockRequestCache.get(blockHash)
  if (!blockRequest) {
    const client = wagmiConfig.getClient({ chainId: transaction.targetChainId })
    blockRequest = getBlock(client, { blockHash })
    blockRequestCache.set(blockHash, blockRequest)
  }

  const { timestamp } = await blockRequest
  store.getState().setTransactionReceipt(transaction, { timestamp: Number(timestamp) * 1000 })
  store.getState().setTransactionStatus(transaction, status)

  const transactionKey = getTransactionKey(transaction)
  transactionRequestCache.delete(transactionKey)
}

export const transactionReceiptListener = (store: UseTransactionManager) =>
  createTransactionListener(
    (s) => s.getTransactionsByStatus('pending'),
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
