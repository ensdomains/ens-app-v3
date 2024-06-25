import {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserverBaseResult,
  InfiniteQueryObserverPendingResult,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useTanstackInfiniteQuery,
} from '@tanstack/react-query'

type UseInfiniteQueryExcludingPendingResult<TData = unknown, TError = DefaultError> = Exclude<
  UseInfiniteQueryResult<TData, TError>,
  InfiniteQueryObserverPendingResult<TData, TError>
>

interface InfiniteQueryObserverCustomResult<TData = unknown, TError = DefaultError>
  extends InfiniteQueryObserverBaseResult<TData, TError> {}

export type CustomInifiniteQueryResult<TData = unknown, TError = DefaultError> =
  | UseInfiniteQueryExcludingPendingResult<TData, TError>
  | InfiniteQueryObserverCustomResult<TData, TError>

export const useInfiniteQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
  client?: QueryClient,
): CustomInifiniteQueryResult<TData, TError> => {
  const enabled = options.enabled ?? true
  const results = useTanstackInfiniteQuery(options, client)
  return {
    ...results,
    isLoading: Boolean(enabled && results.isPending),
  }
}
