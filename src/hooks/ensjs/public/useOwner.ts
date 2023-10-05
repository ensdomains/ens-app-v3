import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import { getOwner, GetOwnerParameters, GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseOwnerParameters = PartialBy<GetOwnerParameters, 'name'>

type UseOwnerReturnType = GetOwnerReturnType

type UseOwnerConfig = QueryConfig<UseOwnerReturnType, Error>

export type UseOwnerQueryKey<TParams extends UseOwnerParameters> = CreateQueryKey<
  TParams,
  'getOwner',
  'standard'
>

export const getOwnerQueryFn = async <TParams extends UseOwnerParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<UseOwnerQueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getOwner(publicClient, { name, ...params })
}

export const useOwner = <TParams extends UseOwnerParameters>({
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
}: TParams & UseOwnerConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getOwner',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getOwnerQueryFn, {
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
