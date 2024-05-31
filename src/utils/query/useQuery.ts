import {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserverBaseResult,
  QueryObserverPendingResult,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query'

type UseQueryResultExcludingPendingResult<TData = unknown, TError = DefaultError> = Exclude<
  UseQueryResult<TData, TError>,
  QueryObserverPendingResult<TData, TError>
>

interface QueryObserverCustomResult<TData = unknown, TError = DefaultError>
  extends QueryObserverBaseResult<TData, TError> {}

export type CustomUseQueryResult<TData = unknown, TError = DefaultError> =
  | UseQueryResultExcludingPendingResult<TData, TError>
  | QueryObserverCustomResult<TData, TError>

export const useQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): CustomUseQueryResult<TData, TError> => {
  const enabled = options.enabled ?? true
  const result = useTanstackQuery(options, queryClient)
  return {
    ...result,
    isLoading: Boolean(enabled && result.isPending),
  }
}
