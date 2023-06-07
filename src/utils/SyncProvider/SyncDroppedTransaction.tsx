import { useEffect, useRef } from 'react'
import { useProvider } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

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

export const SyncDroppedTransaction = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const { dispatch } = useTransactionFlow()
  const { address } = useAccountSafely()
  const transactions = useRecentTransactions()

  useInterval(
    async () => {
      console.log('transactions: ', transactions)
      const currentNonce = await provider.getTransactionCount(address)

      const etherscanEndpoint = `https://api.etherscan.io/api?module=account&action=txlist&address=0x5C7b61a99D922e9a4451Ed62EBbBEdBF1627aB47&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
      const etherscanResponse = await fetch(etherscanEndpoint)
      const etherscanJson = await etherscanResponse.json()
      const accountTransactionHistory = etherscanJson?.result

      if (!accountTransactionHistory) return

      console.log('accountTransactionHistory: ', accountTransactionHistory)

      // Filter by from address
      const filteredTransactionHistory = etherscanJson.result.filter((tx: any) => {
        return tx.from === address?.toLowerCase()
      })
      console.log('filteredTransactionHistory: ', filteredTransactionHistory)

      const latestTransaction = filteredTransactionHistory[0]
      const lastNonceFromHistory = latestTransaction.nonce

      console.log('currentNonce: ', currentNonce)
      console.log('lastNonceFromHistory: ', lastNonceFromHistory)

      const pendingTransactions = transactions.filter(
        (transaction) => transaction.status === 'pending',
      )

      for (const pendingTransaction of pendingTransactions) {
        console.log('pendingTransaction: ', pendingTransaction)
        const getPendingTransactionEndpoint = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${pendingTransaction.hash}&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
        const pendingTransactionResponse = await fetch(getPendingTransactionEndpoint)
        const pendingJson = await pendingTransactionResponse.json()

        if (!pendingJson.result) {
          dispatch({ name: 'setTransactionStage', payload: 'failed' })
          return
        }

        console.log('pendingJson: ', pendingJson)
      }

      return

      for (const transaction of transactions) {
        if (transaction.status === 'pending') {
          console.log('pending: ', transaction)

          const getPendingTransactionEndpoint = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transaction.hash}&apikey=TM9G18GZFWZH22BQF91K6B5H75HT7EVG3M`
          const pendingTransactionResponse = await fetch(getPendingTransactionEndpoint)
          const pendingJson = await pendingTransactionResponse.json()
          console.log('pendingJson: ', pendingJson)

          const pendingTransactionNonce = pendingJson.result?.nonce

          // const detailedTransaction = await provider.getTransaction(transaction.hash)

          // If the nonce of the last transaction in history is equal to or greater than
          // the current nonce of the pending transaction, then the pending transaction
          // has already been mined.

          const lastNonceFromHistory = filteredTransactionHistory[0].nonce

          console.log('currentNonce: ', currentNonce)
          console.log('lastNonceFromHistory: ', lastNonceFromHistory)
          const pendingTransactionNonceDecimal = parseInt(pendingTransactionNonce, 16)

          console.log('pendingTransactionNonce: ', pendingTransactionNonceDecimal)

          if (currentNonce - lastNonceFromHistory > 1) {
            console.log('transaction out of date')
            // Next we need to determine if the replacement transaction was a replacement
            // for this particular transaction or not
          }

          // If transaction is mined, update the status

          // console.log('detailedTransaction: ', detailedTransaction)
        }
      }
    },
    10000,
    [transactions, provider, address, dispatch],
  )

  return <div>{children}</div>
}
