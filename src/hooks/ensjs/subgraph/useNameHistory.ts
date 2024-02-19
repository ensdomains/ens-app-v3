import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import {
  getNameHistory,
  GetNameHistoryParameters,
  GetNameHistoryReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseNameHistoryParameters = PartialBy<GetNameHistoryParameters, 'name'>

type UseNameHistoryReturnType = GetNameHistoryReturnType

type UseNameHistoryConfig = QueryConfig<UseNameHistoryReturnType, Error>

type QueryKey<TParams extends UseNameHistoryParameters> = CreateQueryKey<
  TParams,
  'getNameHistory',
  'graph'
>

export const getNameHistoryQueryFn = async <TParams extends UseNameHistoryParameters>({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getNameHistory(publicClient, { name })
}

export const useNameHistory = <TParams extends UseNameHistoryParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseNameHistoryConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getNameHistory',
    queryDependencyType: 'graph',
  })

  const query = useQuery({
    queryKey,
    queryFn: getNameHistoryQueryFn,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
