import { useCallback } from 'react'
import { useQueryClient } from 'wagmi'

import { Transaction } from '@app/hooks/transactions/transactionStore'

// Checks if a transaction is complete and invalidates the cache for the name
export const useRegisterOrImportNameCallback = () => {
  const queryClient = useQueryClient()
  return useCallback(
    (transaction: Transaction) => {
      if (
        transaction.action !== 'registerName' &&
        transaction.action !== 'importDnsName' &&
        transaction.action !== 'claimDnsName'
      )
        return
      if (transaction.status !== 'confirmed') return

      const name = transaction.key?.match(/-(.*)-/)?.[1]
      if (!name) return

      // We use remove queries instead of invalidate queries because we do not want the possibility
      // of stale data to be used when the data is used for page redirects.
      queryClient.removeQueries({
        predicate: (query) => {
          const {
            queryKey: [params],
          } = query
          if (typeof params !== 'object' || params === null) return false
          if (!('name' in params)) return false
          return params.name === name
        },
      })
    },
    [queryClient],
  )
}
