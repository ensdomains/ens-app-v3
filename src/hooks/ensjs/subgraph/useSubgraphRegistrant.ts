import { QueryFunctionContext, queryOptions } from '@tanstack/react-query'

import {
  getSubgraphRegistrant,
  GetSubgraphRegistrantParameters,
  GetSubgraphRegistrantReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { useQuery } from '@app/utils/query/useQuery'

export type UseSubgraphRegistrantParameters = PartialBy<GetSubgraphRegistrantParameters, 'name'>

export type UseSubgraphRegistrantReturnType = GetSubgraphRegistrantReturnType

export type UseSubgraphRegistrantConfig = QueryConfig<UseSubgraphRegistrantReturnType, Error>

type QueryKey<TParams extends UseSubgraphRegistrantParameters> = CreateQueryKey<
  TParams,
  'getSubgraphRegistrant',
  'graph'
>

export const getSubgraphRegistrantQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseSubgraphRegistrantParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getSubgraphRegistrant(client, { name, ...params })
  }

export const useSubgraphRegistrant = <TParams extends UseSubgraphRegistrantParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseSubgraphRegistrantConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSubgraphRegistrant',
    queryDependencyType: 'graph',
    queryFn: getSubgraphRegistrantQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: getIsCachedData(query),
  }
}
