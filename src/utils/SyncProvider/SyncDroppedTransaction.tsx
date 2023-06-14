import { useEffect, useRef } from 'react'
import { useProvider } from 'wagmi'

import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'

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

const findDroppedTransactions = async (transactions, address, store, chainId, provider) => {
  // Transactions are all tied to an address and a chain
  if (!address || !store || !chainId || !provider || !transactions?.length) return
  console.log('***run***')

  // store.setFailedTransaction(address, chainId, transactions[0].hash)

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending' && transaction.searchStatus === 'found',
  )
  const searchingTransactions = transactions.filter(
    (transaction) => transaction.searchStatus === 'searching',
  )

  console.log('searchingTransactions: ', searchingTransactions)

  for (const searchingTransaction of searchingTransactions) {
    console.log('searchingTransaction: ', searchingTransaction)
    const result = await provider.getTransaction(searchingTransaction.hash)
    console.log('result: ', result)

    if (result) {
      store.foundTransaction(address, chainId, searchingTransaction.hash, result.nonce, result.data)
      return
    }
    store.updateRetries(address, chainId, searchingTransaction.hash)
  }

  for (const pendingTransaction of pendingTransactions) {
    console.log('pendingTransaction: ', pendingTransaction)

    const currentNonce = await provider.getTransactionCount(address)

    if (currentNonce > pendingTransaction.nonce) {
      // Transaction either got replaced or has been cancelled

      // Find tranasaction in user's history based on nonce
      const etherscanEndpoint = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
      const etherscanResponse = await fetch(etherscanEndpoint)
      const etherscanJson = await etherscanResponse.json()
      const accountTransactionHistory = etherscanJson?.result

      // Get matching nonce from history
      const matchingNonceTransaction = accountTransactionHistory.find((tx: any) => {
        return parseInt(tx.nonce, 10) === pendingTransaction.nonce
      })
      console.log('matchingNonceTransaction: ', matchingNonceTransaction)

      // See if matching nonce transaction is a replacement
      if (matchingNonceTransaction?.input === pendingTransaction?.transactionInput) {
        console.log('replacement!')
        store.setReplacedTransaction(
          address,
          chainId,
          pendingTransaction.hash,
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
      debugger
      store.setFailedTransaction(address, chainId, pendingTransaction.hash)
    }

    // If the transaction has not been cancelled or replaced, it may have been dropped
    const result = await provider.getTransaction(pendingTransaction.hash)
    console.log('result: ', result)
    if (!result) {
      // If a pending transaction is not found, it has been dropped
      debugger
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
