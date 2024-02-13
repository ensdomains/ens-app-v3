import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

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
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseOwnerConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getOwner',
    queryDependencyType: 'standard',
  })

  const query = useQuery({
    queryKey,
    queryFn: getOwnerQueryFn,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
