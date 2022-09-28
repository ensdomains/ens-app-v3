import { useEffect, useRef } from 'react'

import { Transaction } from './transactionStore'
import { useRecentTransactions } from './useRecentTransactions'

export type UpdateCallback = (transaction: Transaction) => void

const useCallbackOnTransaction = (callback: UpdateCallback) => {
  const transactions = useRecentTransactions()
  const previousTransactions = useRef<Transaction[]>()

  useEffect(() => {
    const updatedTransactions = transactions.filter((transaction) => {
      if (previousTransactions.current) {
        const prevTransaction = previousTransactions.current.find(
          (tr) => tr.hash === transaction.hash,
        )
        if (prevTransaction) {
          return prevTransaction.status !== transaction.status
        }
      }
      return false
    })
    previousTransactions.current = JSON.parse(JSON.stringify(transactions))
    updatedTransactions.forEach(callback)
  }, [callback, transactions])
}

export default useCallbackOnTransaction
