import { useAccount } from '@web3modal/react'
import { useCallback } from 'react'

import { useChainId } from '../useChainId'
import { useTransactionStore } from './TransactionStoreContext'

export function useClearRecentTransactions(): () => void {
  const store = useTransactionStore()
  const { account } = useAccount()
  const chainId = useChainId()

  return useCallback(() => {
    if (!account?.address || !chainId) {
      throw new Error('No address or chain ID found')
    }

    store.clearTransactions(account?.address, chainId)
  }, [store, account?.address, chainId])
}
