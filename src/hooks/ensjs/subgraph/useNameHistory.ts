import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from '@tanstack/react-query'

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
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseNameHistoryConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getNameHistory',
    queryDependencyType: 'graph',
  })

  const query = useQuery(queryKey, getNameHistoryQueryFn, {
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
