import { QueryClient } from '@tanstack/react-query'

import { SupportedChain } from '@app/constants/chains'
import { Transaction } from '@app/hooks/transactions/transactionStore'

// Checks if a transaction is complete and invalidates the cache for the name
export const clearRelevantNameQueriesFromRegisterOrImport = ({
  queryClient,
  chainId,
  updatedTransactions,
}: {
  queryClient: QueryClient
  chainId: SupportedChain['id']
  updatedTransactions: Transaction[]
}) => {
  const namesFromTransactions = updatedTransactions.reduce<string[]>((acc, transaction) => {
    if (
      transaction.status === 'confirmed' &&
      (transaction.action === 'registerName' ||
        transaction.action === 'importDnsName' ||
        transaction.action === 'claimDnsName')
    ) {
      const name = transaction.key?.match(/-(.*)-/)?.[1]
      if (name) acc.push(name)
    }
    return acc
  }, [])
  if (!namesFromTransactions.length) return
  // We use remove queries instead of invalidate queries because we do not want the possibility
  // of stale data to be used when the data is used for page redirects.
  return queryClient.removeQueries({
    predicate: (query) => {
      const {
        queryKey: [params, queryChainId],
      } = query
      if (typeof params !== 'object' || params === null) return false
      if (!('name' in params) || typeof params.name !== 'string') return false
      if (typeof chainId !== 'number' || chainId !== queryChainId) return false
      return namesFromTransactions.includes(params.name)
    },
  })
}
