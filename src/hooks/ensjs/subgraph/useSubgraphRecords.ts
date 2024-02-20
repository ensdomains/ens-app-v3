import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { Config } from 'wagmi'

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

export const getSubgraphRecordsQueryFn =
  (config: Config) =>
  async <TParams extends UseSubgraphRecordsParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

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
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSubgraphRecords',
    queryDependencyType: 'graph',
    queryFn: getSubgraphRecordsQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.name,
    gcTime,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
