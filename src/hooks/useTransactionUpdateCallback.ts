import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import { useEffect, useRef } from 'react'

import { TransactionName } from '@app/transaction-flow/transaction'

export type UpdateCallback = (
  action: TransactionName,
  key: string,
  status: 'pending' | 'confirmed' | 'failed',
  hash: string,
) => void

const useTransactionUpdateCallback = (callback: UpdateCallback) => {
  const transactions = useRecentTransactions()
  const previousTransactions = useRef<ReturnType<typeof useRecentTransactions>>()

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
    for (const transaction of updatedTransactions) {
      const { hash, status, description } = transaction
      const { action, key } = JSON.parse(description)
      callback(action as TransactionName, key, status, hash)
    }
  }, [callback, transactions])
}

export default useTransactionUpdateCallback
