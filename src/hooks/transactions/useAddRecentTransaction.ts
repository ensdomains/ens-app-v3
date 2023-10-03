import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useChainId } from '../chain/useChainId'
import { NewTransaction } from './transactionStore'
import { useTransactionStore } from './TransactionStoreContext'

export function useAddRecentTransaction(): (transaction: NewTransaction) => void {
  const store = useTransactionStore()
  const { address } = useAccount()
  const chainId = useChainId()

  return useCallback(
    (transaction: NewTransaction) => {
      if (!address || !chainId) {
        throw new Error('No address or chain ID found')
      }

      store.addTransaction(address, chainId, transaction)
    },
    [store, address, chainId],
  )
}
