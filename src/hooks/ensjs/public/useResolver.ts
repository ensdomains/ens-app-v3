import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import { getResolver, GetResolverParameters, GetResolverReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseResolverParameters = PartialBy<GetResolverParameters, 'name'>

type UseResolverReturnType = GetResolverReturnType

type UseResolverConfig = QueryConfig<UseResolverReturnType, Error>

type QueryKey<TParams extends UseResolverParameters> = CreateQueryKey<
  TParams,
  'getResolver',
  'standard'
>

export const getResolverQueryFn = async <TParams extends UseResolverParameters>({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getResolver(publicClient, { name })
}

export const useResolver = <TParams extends UseResolverParameters>({
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
}: TParams & UseResolverConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getResolver',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getResolverQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name,
    staleTime,
    onError,
    onSettled,
    onSuccess,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
