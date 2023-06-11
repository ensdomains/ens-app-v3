import { useEffect, useRef } from 'react'
import { useProvider } from 'wagmi'

import { useTransactionStore } from '@app/hooks/transactions/TransactionStoreContext'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { hexToNumber } from '../utils'

function useInterval(callback: () => void, delay: number | null, dependency: any) {
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
  }, [delay, dependency])
}

const checkForReplacementTransaction = async (provider, address, pendingTransaction) => {
  const etherscanEndpoint = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=0x5C7b61a99D922e9a4451Ed62EBbBEdBF1627aB47&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
  const etherscanResponse = await fetch(etherscanEndpoint)
  const etherscanJson = await etherscanResponse.json()
  const accountTransactionHistory = etherscanJson?.result
  const currentNonce = await provider.getTransactionCount(address)

  // Just mark the transaction as failed if we can't get the couunt history for some reason
  if (!accountTransactionHistory) return false
  console.log('accountTransactionHistory: ', accountTransactionHistory)

  // Filter by from address
  const filteredTransactionHistory = etherscanJson.result.filter((tx: any) => {
    return tx.from === address?.toLowerCase()
  })
  const latestTransaction = filteredTransactionHistory[0]
  const lastNonceFromHistory = latestTransaction.nonce

  console.log('latestTransaction: ', latestTransaction)

  // const pendingTransactionDetails = await provider.getTransaction(pendingTransaction.hash)

  console.log('currentNonce: ', currentNonce)
  console.log('lastNonceFromHistory: ', lastNonceFromHistory)
  console.log('pendingTransaction: ', pendingTransaction)
  // console.log('pendingTransactinDetails: ', pendingTransactionDetails)
}

export const SyncDroppedTransaction = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const { dispatch } = useTransactionFlow()
  const { address } = useAccountSafely()
  const transactions = useRecentTransactions()
  const store = useTransactionStore()
  const chainId = useChainId()

  useInterval(
    async () => {
      console.log('transactions: ', transactions)

      // Transactions are all tied to an address and a chain
      if (!address) return

      const pendingTransactions = transactions.filter(
        (transaction) => transaction.status === 'pending',
      )
      const searchingTransactions = transactions.filter(
        (transaction) => transaction.status === 'searching',
      )

      for (const searchingTransaction of searchingTransactions) {
        console.log('searchingTransaction: ', searchingTransaction)
        const getPendingTransactionEndpoint = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${searchingTransaction.hash}&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
        const pendingTransactionResponse = await fetch(getPendingTransactionEndpoint)
        const pendingJson = await pendingTransactionResponse.json()
        const { result } = pendingJson
        console.log('searchingJson: ', pendingJson)
        if (pendingJson.result) {
          const nonce = hexToNumber(result?.nonce)
          store.foundTransaction(address, chainId, searchingTransaction.hash, nonce, result.input)
          return
        }
        store.updateRetries(address, chainId, searchingTransaction.hash)
      }

      for (const pendingTransaction of pendingTransactions) {
        console.log('pendingTransaction: ', pendingTransaction)

        const currentNonce = await provider.getTransactionCount(address)
        console.log('currentNonce: ', currentNonce)

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
          if (matchingNonceTransaction.input === pendingTransaction.transactionInput) {
            console.log('replacement!')
            store.setReplacedTransaction(
              address,
              chainId,
              pendingTransaction.hash,
              matchingNonceTransaction,
            )
          }

          // If the transaction was not replaced then it is a failed transaction
          store.setFailedTransaction(address, chainId, pendingTransaction.hash)
        }

        // If the transaction has not been cancelled or replaced, it may have been dropped

        const getPendingTransactionEndpoint = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${pendingTransaction.hash}&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
        const pendingTransactionResponse = await fetch(getPendingTransactionEndpoint)
        const pendingJson = await pendingTransactionResponse.json()

        if (!pendingJson.result) {
          // If a pending transaction is not found, it has been dropped
          store.setFailedTransaction(address, chainId, pendingTransaction.hash)
          return
        }
      }
    },
    10000,
    [transactions, provider, address, dispatch],
  )

  return <div>{children}</div>
}
