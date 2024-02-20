import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'wagmi'

import {
  getSubnames,
  GetSubnamesParameters,
  GetSubnamesReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, InfiniteQueryConfig, PartialBy, PublicClientWithChain } from '@app/types'

type UseSubnamesParameters = Omit<PartialBy<GetSubnamesParameters, 'name'>, 'previousPage'>

type UseSubnamesReturnType = GetSubnamesReturnType

type UseSubnamesConfig = InfiniteQueryConfig<UseSubnamesReturnType, Error>

type QueryKey<TParams extends UseSubnamesParameters> = CreateQueryKey<
  TParams,
  'getSubnames',
  'graph'
>

export const getSubnamesQueryFn = async <TParams extends UseSubnamesParameters>({
  queryKey: [{ name, ...params }, chainId],
  pageParam,
}: QueryFunctionContext<QueryKey<TParams>, GetSubnamesReturnType>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getSubnames(publicClient, { name, ...params, previousPage: pageParam })
}

export const useSubnames = <TParams extends UseSubnamesParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseSubnamesConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getSubnames',
    queryDependencyType: 'graph',
  })

  const { data, status, isFetched, isFetchedAfterMount, ...rest } = useInfiniteQuery(
    queryKey,
    getSubnamesQueryFn,
    {
      gcTime,
      enabled: enabled && !!params.name,
      staleTime,

      getNextPageParam: (lastPage) => {
        if (lastPage?.length < (params.pageSize || 100)) return false
        return lastPage
      },
    },
  )

  const pageCount = data?.pages.length || 0
  const nameCount = data?.pages.reduce((acc, page) => acc + page.length, 0) || 0

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  return {
    data,
    infiniteData,
    page: data?.pages[0] || [],
    pageCount,
    nameCount,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
