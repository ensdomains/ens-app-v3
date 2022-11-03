import { useAccount } from '@web3modal/react'
import { useCallback } from 'react'

import { useChainId } from '../useChainId'
import { useTransactionStore } from './TransactionStoreContext'
import { NewTransaction } from './transactionStore'

export function useAddRecentTransaction(): (transaction: NewTransaction) => void {
  const store = useTransactionStore()
  const { account } = useAccount()
  const chainId = useChainId()

  return useCallback(
    (transaction: NewTransaction) => {
      if (!account?.address || !chainId) {
        throw new Error('No address or chain ID found')
      }

      store.addTransaction(account?.address, chainId, transaction)
    },
    [store, account?.address, chainId],
  )
}
