/* eslint-disable no-await-in-loop */
import { useEffect, useRef } from 'react'
import { TransactionNotFoundError, type Address } from 'viem'
import { getTransaction, getTransactionCount } from 'viem/actions'
import { useClient } from 'wagmi'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import type {
  EtherscanMinedData,
  Transaction,
  TransactionStore,
} from '@app/hooks/transactions/transactionStore'
import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { ClientWithEns } from '@app/types'

const TRANSACTION_SEARCH_INTERVAL = 10000

export const getAccountHistoryEndpoint = (address: string, chainId: number) => {
  switch (chainId) {
    case 1:
      return `https://etherscan-api.ens-cf.workers.dev/accountHistory?address=${address}`
    case 5:
      return `https://etherscan-api-goerli.ens-cf.workers.dev/accountHistory?address=${address}`
    case 11155111:
      return `https://etherscan-api-sepolia.ens-cf.workers.dev/accountHistory?address=${address}`
    default:
      return ''
  }
}

function useInterval(callback: () => void, delay: number | null, dependencies: any[]) {
  const savedCallback = useRef<() => void>(() => {})

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    tick()

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...dependencies])
}

export const findDroppedTransactions = async (
  client: ClientWithEns,
  {
    transactions,
    address,
    store,
  }: {
    transactions: Transaction[]
    address: Address | undefined
    store: TransactionStore | undefined
  },
) => {
  const chainId = client.chain.id
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending' && transaction.searchStatus === 'found',
  )
  const searchingTransactions = transactions.filter(
    (transaction) => transaction.searchStatus === 'searching',
  )

  // Transactions are all tied to an address and a chain
  if (
    !address ||
    !store ||
    !chainId ||
    !client ||
    !transactions?.length ||
    (!pendingTransactions.length && !searchingTransactions.length)
  ) {
    return
  }

  const etherscanEndpoint = getAccountHistoryEndpoint(address, chainId)
  const etherscanResponse = etherscanEndpoint
    ? await fetch(etherscanEndpoint).catch((e) => {
        console.error(e)
        return { ok: false } as const
      })
    : ({ ok: false } as const)
  const etherscanJson: EtherscanMinedData[] = etherscanResponse.ok
    ? await etherscanResponse.json()
    : []
  const accountTransactionHistory = etherscanJson

  // Skip if etherscan api fails or returns no history
  if (accountTransactionHistory.length === 0) return

  for (const searchingTransaction of searchingTransactions) {
    // A searchingTransaction likely means the transaction was submitted to a private mempool
    // Once we see it it is likely a mined transaction already.
    // Also we won't have the nonce, so will have to wait for it to drop into account history
    // and will match on transaction hash instead

    const minedTransaction = accountTransactionHistory.filter(
      (historicTransaction) => historicTransaction.hash === searchingTransaction.hash,
    )

    if (minedTransaction.length) {
      store.foundMinedTransaction(address, chainId, searchingTransaction.hash, minedTransaction[0])
      return
    }

    // If hash is not the same then it might be a replacement

    // If timestamp on mined transaction is after the time we sent the transactions, and the input is the
    // same, we can assume it was a replacement. Best we can do since we don't have the nonce
    const replacementTransactions = accountTransactionHistory.filter(
      (historicTransaction) =>
        historicTransaction.input === searchingTransaction.input &&
        parseInt(historicTransaction.timeStamp, 10) > (searchingTransaction?.timestamp ?? 0),
    )

    if (replacementTransactions.length > 1) {
      console.error('Ambiguous transaction replacement')
      return
    }

    if (replacementTransactions.length === 1) {
      const _replacementTransaction = replacementTransactions[0]
      store.setReplacedTransaction(
        address,
        chainId,
        _replacementTransaction.input,
        _replacementTransaction,
      )
      return
    }

    // If for some reason the transaction was not found, was not a replacement etc, try to find it again.
    const result = await getTransaction(client, { hash: searchingTransaction.hash }).catch(
      (e: unknown) => {
        if (e instanceof TransactionNotFoundError) return null
        throw e
      },
    )
    if (result) {
      store.foundTransaction(address, chainId, searchingTransaction.hash, result.nonce)
      return
    }

    // If the transaction is a safe transaction, we don't need to retry it or check for cancellations
    if (searchingTransaction.isSafeTx) return

    // If there is a transaction in history with a timestamp ahead of the searching transaction
    // at this point, then we can assume the searchingTransaction was cancelled
    const cancelledTransactions = accountTransactionHistory.filter(
      (historicTransaction) =>
        parseInt(historicTransaction.timeStamp, 10) > (searchingTransaction?.timestamp ?? 0),
    )
    if (cancelledTransactions.length > 0) {
      store.setFailedTransaction(address, chainId, searchingTransaction.hash)
      return
    }

    store.updateRetries(address, chainId, searchingTransaction.hash)
  }

  for (const pendingTransaction of pendingTransactions) {
    const currentNonce = await getTransactionCount(client, { address })

    if (currentNonce > (pendingTransaction?.nonce ?? -1)) {
      // Transaction either got replaced or has been cancelled

      // Find tranasaction in user's history based on nonce
      // Get matching nonce from history
      const matchingNonceTransaction = accountTransactionHistory.find((tx: any) => {
        return parseInt(tx.nonce, 10) === pendingTransaction.nonce
      })

      // See if matching nonce transaction is a replacement
      if (
        matchingNonceTransaction &&
        matchingNonceTransaction?.input === pendingTransaction?.input
      ) {
        store.setReplacedTransactionByNonce(
          address,
          chainId,
          pendingTransaction?.input ?? ``,
          matchingNonceTransaction,
        )
        return
      }

      // If there is a gap between account nonce and latest nonce in history
      // it is possible that etherscan history is behind
      if (currentNonce - parseInt(accountTransactionHistory[0].nonce, 10) > 1) {
        // Wait for etherscan history to update
        return
      }

      // If the transaction was not replaced then it is a failed transaction
      store.setFailedTransaction(address, chainId, pendingTransaction.hash)
    }

    // If the transaction has not been cancelled or replaced, it may have been dropped
    const result = await getTransaction(client, { hash: pendingTransaction.hash })
    if (!result) {
      // If a pending transaction is not found, it has been dropped
      store.setFailedTransaction(address, chainId, pendingTransaction.hash)
      return
    }
  }
}

export const SyncDroppedTransaction = ({ children }: { children: React.ReactNode }) => {
  const client = useClient()
  const { address } = useAccountSafely()
  const transactions = useRecentTransactions()
  const store = useTransactionStore()

  useInterval(
    () => findDroppedTransactions(client, { address, store, transactions }),
    TRANSACTION_SEARCH_INTERVAL,
    [address, client.chain.id, store, transactions.length],
  )

  return <div>{children}</div>
}
