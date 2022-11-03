import { useAccount, useProvider } from '@web3modal/react'
import { providers } from 'ethers'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { useChainId } from '../useChainId'
import { TransactionStore, createTransactionStore } from './transactionStore'

// Only allow a single instance of the store to exist at once
// so that multiple RainbowKitProvider instances can share the same store.
// We delay the creation of the store until the first time it is used
// so that it always has access to a provider.
let storeSingleton: ReturnType<typeof createTransactionStore> | undefined

const TransactionStoreContext = createContext<TransactionStore | null>(null)

export function TransactionStoreProvider({ children }: { children: React.ReactNode }) {
  const { provider, isReady } = useProvider<providers.BaseProvider>()
  const { account } = useAccount()

  const chainId = useChainId()

  // Use existing store if it exists, or lazily create one
  const [store] = useState(
    () =>
      storeSingleton ??
      (storeSingleton = createTransactionStore({ provider: providers.BaseProvider })),
  )

  // Keep store provider up to date with any wagmi changes
  useEffect(() => {
    if (provider && isReady) {
      store.setProvider(provider)
    }
  }, [store, provider, isReady])

  // Wait for pending transactions whenever address or chainId changes
  useEffect(() => {
    if (account.address && chainId) {
      store.waitForPendingTransactions(account.address, chainId)
    }
  }, [store, account, chainId])

  return (
    <TransactionStoreContext.Provider value={store}>{children}</TransactionStoreContext.Provider>
  )
}

export function useTransactionStore() {
  const store = useContext(TransactionStoreContext)

  if (!store) {
    throw new Error('Transaction hooks must be used within Web3ModalProvider')
  }

  return store
}
