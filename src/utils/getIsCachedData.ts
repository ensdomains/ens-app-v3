import type { DefaultError } from '@tanstack/react-query'

import type { CustomUseQueryResult } from './query/useQuery'

export const getIsCachedData = <TData = unknown, TError = DefaultError>(
  query: CustomUseQueryResult<TData, TError>,
) =>
  query.status === 'success' &&
  query.isFetched &&
  ((!query.isFetchedAfterMount && query.isFetching) || query.isRefetching) &&
  query.isStale
