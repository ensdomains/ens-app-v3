import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

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
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
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
    cacheTime,
    enabled: enabled && !!params.name,
    staleTime,
    onError,
    onSettled,
    onSuccess,
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
