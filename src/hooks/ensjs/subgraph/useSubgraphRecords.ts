import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import {
  getSubgraphRecords,
  GetSubgraphRecordsParameters,
  GetSubgraphRecordsReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseSubgraphRecordsParameters = PartialBy<GetSubgraphRecordsParameters, 'name'>

type UseSubgraphRecordsReturnType = GetSubgraphRecordsReturnType

type UseSubgraphRecordsConfig = QueryConfig<UseSubgraphRecordsReturnType, Error>

type QueryKey<TParams extends UseSubgraphRecordsParameters> = CreateQueryKey<
  TParams,
  'getSubgraphRecords',
  'graph'
>

export const getSubgraphRecordsQueryFn = async <TParams extends UseSubgraphRecordsParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getSubgraphRecords(publicClient, { name, ...params })
}

export const useSubgraphRecords = <TParams extends UseSubgraphRecordsParameters>({
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
}: TParams & UseSubgraphRecordsConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getSubgraphRecords',
    queryDependencyType: 'graph',
  })

  const query = useQuery(queryKey, getSubgraphRecordsQueryFn, {
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
