import type { UseQueryResult } from '@tanstack/react-query'

export const getIsCachedData = <TData = unknown, TError = Error>(
  query: UseQueryResult<TData, TError>,
) =>
  query.status === 'success' &&
  query.isFetched &&
  ((!query.isFetchedAfterMount && query.isFetching) || query.isRefetching) &&
  query.isStale
