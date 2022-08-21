import { QueriesObserver, QueryFilters, QueryKey, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export const useIsCachedData = (
  queryKey?: QueryKey | undefined,
  queryFilters?: QueryFilters | undefined,
) => {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()
  const foundQueries = cache.findAll(queryKey, queryFilters)
  const [observer] = useState(() => new QueriesObserver(queryClient, foundQueries))
  const results = observer.getOptimisticResult(foundQueries)
  return useMemo(() => {
    let isCached = false
    for (const result of results) {
      if (result.status === 'success' && result.isFetched && !result.isFetchedAfterMount) {
        isCached = true
        break
      }
    }
    return isCached
  }, [results])
}
