import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import {
  getSubgraphRecords,
  GetSubgraphRecordsParameters,
  GetSubgraphRecordsReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
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
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseSubgraphRecordsConfig) => {
  const { queryKey } = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSubgraphRecords',
    queryDependencyType: 'graph',
  })

  const query = useQuery({
    queryKey,
    queryFn: getSubgraphRecordsQueryFn,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
