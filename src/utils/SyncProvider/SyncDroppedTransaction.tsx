import { useEffect, useRef } from 'react'
import { useProvider } from 'wagmi'

import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'

const accountHistoryEndpoints = {
  1: (address) =>
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`,
  5: (address) =>
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`,
}

function useIntervalStrict(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {})

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
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
  }, [delay, ...dependencies])
}

const handleSearchingTransactions = () => {}
const handlePendingTransactions = () => {}

const findDroppedTransactions = async (transactions, address, store, chainId, provider) => {
  // Transactions are all tied to an address and a chain
  if (!address || !store || !chainId || !provider || !transactions?.length) return
  console.log('***run***')
  console.log('chainId: ', chainId)

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending' && transaction.searchStatus === 'found',
  )
  const searchingTransactions = transactions.filter(
    (transaction) => transaction.searchStatus === 'searching',
  )

  const etherscanEndpoint = accountHistoryEndpoints[chainId]?.(address)
  const etherscanResponse = await fetch(etherscanEndpoint)
  const etherscanJson = await etherscanResponse.json()
  const accountTransactionHistory = etherscanJson?.result
  console.log('accountTransactionHistory: ', accountTransactionHistory)

  console.log('searchingTransactions: ', searchingTransactions)

  for (const searchingTransaction of searchingTransactions) {
    // A searchingTransaction likely means the transaction was submitted to a private mempool
    // Once we see it it is likely a mined transaction already.
    // Also we won't have the nonce, so will have to wait for it to drop into account history
    // and will match on transaction hash instead

    const minedTransaction = accountTransactionHistory.filter(
      (historicTransaction) => historicTransaction.hash === searchingTransaction.hash,
    )

    console.log('minedTransaction: ', minedTransaction)

    if (minedTransaction.length) {
      store.foundMinedTransaction(address, chainId, searchingTransaction.hash, minedTransaction[0])
      return
    }

    // If hash is not the same then it might be a replacement

    // If timestamp on mined transaction if after the time we sent the transactions, and the input is the
    // same, we can assume it was a replacement. Best we can do since we don't have the nonce
    const replacementTransactions = accountTransactionHistory.filter(
      (historicTransaction) =>
        historicTransaction.input === searchingTransaction.input &&
        parseInt(historicTransaction.timeStamp, 10) > searchingTransaction.timestamp,
    )

    if (replacementTransactions.length > 1) {
      console.error('Ambiguous transaction replacement')
      return
    }

    if (replacementTransactions.length === 1) {
      const _replacementTransaction = replacementTransactions[0]
      console.log('_replacementTransactions: ', _replacementTransaction)
      store.setReplacedTransaction(
        address,
        chainId,
        _replacementTransaction.input,
        _replacementTransaction,
      )
      return
    }

    // If for some reason the transaction was not found, was not a replacement etc, try to find it again.
    const result = await provider.getTransaction(searchingTransaction.hash)
    if (result) {
      store.foundTransaction(address, chainId, searchingTransaction.hash, result.nonce, result.data)
      return
    }
    // store.updateRetries(address, chainId, searchingTransaction.hash)
  }

  for (const pendingTransaction of pendingTransactions) {
    console.log('pendingTransaction: ', pendingTransaction)

    const currentNonce = await provider.getTransactionCount(address)

    if (currentNonce > pendingTransaction.nonce) {
      // Transaction either got replaced or has been cancelled

      // Find tranasaction in user's history based on nonce

      // Get matching nonce from history
      const matchingNonceTransaction = accountTransactionHistory.find((tx: any) => {
        return parseInt(tx.nonce, 10) === pendingTransaction.nonce
      })
      console.log('matchingNonceTransaction: ', matchingNonceTransaction)

      // See if matching nonce transaction is a replacement
      if (matchingNonceTransaction?.input === pendingTransaction?.input) {
        console.log('replacement!')
        store.setReplacedTransactionByNonce(
          address,
          chainId,
          pendingTransaction.input,
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
    const result = await provider.getTransaction(pendingTransaction.hash)
    console.log('result: ', result)
    if (!result) {
      // If a pending transaction is not found, it has been dropped
      store.setFailedTransaction(address, chainId, pendingTransaction.hash)
      return
    }
  }
}

export const SyncDroppedTransaction = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const { address } = useAccountSafely()
  const transactions = useRecentTransactions()
  const store = useTransactionStore()
  const chainId = useChainId()

  console.log('transactions: ', transactions)

  useInterval(
    () => findDroppedTransactions(transactions, address, store, chainId, provider),
    10000,
    [address, chainId, store, provider, ...transactions.map((x) => x.hash)],
    // [transactions, address, store, chainId, provider],
  )

  return <div>{children}</div>
}
