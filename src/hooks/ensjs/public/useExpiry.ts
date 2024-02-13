import { QueryFunctionContext, useQuery , useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import { getExpiry, GetExpiryParameters, GetExpiryReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseExpiryParameters = PartialBy<GetExpiryParameters, 'name'>

type UseExpiryReturnType = GetExpiryReturnType

type UseExpiryConfig = QueryConfig<UseExpiryReturnType, Error>

type QueryKey<TParams extends UseExpiryParameters> = CreateQueryKey<
  TParams,
  'getExpiry',
  'standard'
>

export const getExpiryQueryFn = async <TParams extends UseExpiryParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getExpiry(publicClient, { name, ...params })
}

export const useExpiry = <TParams extends UseExpiryParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
 
  // params
  ...params
}: TParams & UseExpiryConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getExpiry',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getExpiryQueryFn, {
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,

    select: (data) => {
      if (!data) return null
      return {
        ...data,
        expiry: {
          ...data.expiry,
          date: new Date(data.expiry.date),
        },
      }
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
