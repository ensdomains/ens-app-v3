import { useAccount } from '@web3modal/react'
import { useEffect, useState } from 'react'

import { useChainId } from '../useChainId'
import { useTransactionStore } from './TransactionStoreContext'
import type { Transaction } from './transactionStore'

export function useRecentTransactions(): Transaction[] {
  const store = useTransactionStore()
  const { account } = useAccount()
  const chainId = useChainId()

  const [transactions, setTransactions] = useState(() =>
    store && account?.address && chainId ? store.getTransactions(account?.address, chainId) : [],
  )

  useEffect(() => {
    if (store && account?.address && chainId) {
      setTransactions(store.getTransactions(account?.address, chainId))

      return store.onChange(() => {
        setTransactions(store.getTransactions(account?.address, chainId))
      })
    }
  }, [store, account?.address, chainId])

  return transactions
}
