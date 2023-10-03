import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { useChainId } from '../chain/useChainId'
import type { Transaction } from './transactionStore'
import { useTransactionStore } from './TransactionStoreContext'

export function useRecentTransactions(): Transaction[] {
  const store = useTransactionStore()
  const { address } = useAccount()
  const chainId = useChainId()

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (store && address && chainId) {
      setTransactions(store.getTransactions(address, chainId))

      return store.onChange(() => {
        setTransactions(store.getTransactions(address, chainId))
      })
    }
  }, [store, address, chainId])

  return transactions
}
