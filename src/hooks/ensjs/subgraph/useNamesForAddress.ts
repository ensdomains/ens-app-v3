import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useEffect, useMemo, useState } from 'react'

import {
  getNamesForAddress,
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, InfiniteQueryConfig, PartialBy, PublicClientWithChain } from '@app/types'

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

export const getNamesForAddressQueryFn = async <TParams extends UseNamesForAddressParameters>({
  queryKey: [{ address, ...params }, chainId],
  pageParam,
}: QueryFunctionContext<QueryKey<TParams>, GetNamesForAddressReturnType>) => {
  if (!address) throw new Error('address is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getNamesForAddress(publicClient, { address, ...params, previousPage: pageParam })
}

export const useNamesForAddress = <TParams extends UseNamesForAddressParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseNamesForAddressConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getNamesForAddress',
    queryDependencyType: 'graph',
  })

  const [unfilteredPages, setUnfilteredPages] = useState<GetNamesForAddressReturnType>([])

  const { data, status, isFetched, isFetching, isLoading, isFetchedAfterMount, ...rest } =
    useInfiniteQuery({
      queryKey,
      queryFn: getNamesForAddressQueryFn,
      gcTime,
      enabled: enabled && !!params.address,
      staleTime,
      getNextPageParam: (lastPage) => {
        if (lastPage?.length < (params.pageSize || 100)) return false
        return lastPage
      },
    })

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
