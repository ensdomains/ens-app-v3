import { useCallback } from 'react'
import { useQueryClient } from 'wagmi'

import { Transaction } from '@app/hooks/transactions/transactionStore'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

// Checks if a transaction is complete and invalidates the cache for the name
export const useRegisterNameCallback = () => {
  const queryClient = useQueryClient()
  const queryKeys = useQueryKeys()
  return useCallback(
    (transaction: Transaction) => {
      if (transaction.action !== 'registerName' || transaction.status !== 'confirmed') return

      const name = transaction.key?.match(/-(.*)-/)?.[1]
      if (!name) return

      // We use remove queries instead of invalidate queries because we do not want the possibility
      // of stale data to be used when the data is used for page redirects.
      queryClient.removeQueries(queryKeys.basicNameRoot(name))
    },
    [queryClient, queryKeys],
  )
}
