import {
  DataTag,
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query'

export function prepareQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData>
}
export function prepareQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData>
}
export function prepareQueryOptions(options: Record<string, any>) {
  const newOptions = {} as Record<string, any>
  for (const key in options) {
    if (options[key] !== undefined) {
      newOptions[key] = options[key]
    }
  }
  return newOptions
}
