import { infiniteQueryOptions, QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import {
  getNamesForAddress,
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, InfiniteQueryConfig, PartialBy } from '@app/types'

type UseNamesForAddressParameters = Omit<
  PartialBy<GetNamesForAddressParameters, 'address'>,
  'previousPage'
>

type UseNamesForAddressReturnType = GetNamesForAddressReturnType

type UseNamesForAddressConfig = InfiniteQueryConfig<UseNamesForAddressReturnType, Error>

type QueryKey<TParams extends UseNamesForAddressParameters> = CreateQueryKey<
  TParams,
  'getNamesForAddress',
  'graph'
>

export const getNamesForAddressQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNamesForAddressParameters>({
    queryKey: [{ address, ...params }, chainId],
    pageParam,
  }: QueryFunctionContext<QueryKey<TParams>, GetNamesForAddressReturnType>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    return getNamesForAddress(client, { address, ...params, previousPage: pageParam })
  }

const getNextPageParam =
  <TParams extends UseNamesForAddressParameters>(params: TParams) =>
  (lastPage: GetNamesForAddressReturnType) => {
    if (lastPage?.length < (params.pageSize || 100)) return null
    return lastPage
  }

const initialPageParam = [] as GetNamesForAddressReturnType

export const useNamesForAddress = <TParams extends UseNamesForAddressParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseNamesForAddressConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getNamesForAddress',
    queryDependencyType: 'graph',
    queryFn: getNamesForAddressQueryFn,
  })

  const preparedOptions = infiniteQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    getNextPageParam: getNextPageParam(params),
    initialPageParam,
  })

  const { data, status, isFetched, isFetching, isLoading, isFetchedAfterMount, ...rest } =
    useInfiniteQuery({
      ...preparedOptions,
      enabled: enabled && !!params.address,
      gcTime,
      staleTime,
    })

  const [unfilteredPages, setUnfilteredPages] = useState<GetNamesForAddressReturnType>([])

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  useEffect(() => {
    if (!params.filter?.searchString) {
      setUnfilteredPages(infiniteData)
    }
  }, [params.filter?.searchString, infiniteData])

  const infiniteDataWithFetchingFill = useMemo(
    () =>
      params.filter?.searchString && isFetching
        ? unfilteredPages.filter((x) => x.labelName?.includes(params.filter!.searchString!))
        : infiniteData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetching, unfilteredPages, params.filter?.searchString, infiniteData],
  )

  const nameCount = infiniteDataWithFetchingFill.length || 0

  return {
    data,
    infiniteData: infiniteDataWithFetchingFill,
    page: data?.pages[0] || [],
    nameCount,
    status,
    isFetched,
    isFetching,
    isFetchedAfterMount,
    isLoading: !params.filter?.searchString
      ? isLoading
      : !infiniteDataWithFetchingFill.length && isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
