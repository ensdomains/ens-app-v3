import { QueryFunctionContext } from '@tanstack/react-query'

import type {
  GetSubgraphRecordsParameters,
  GetSubgraphRecordsReturnType,
} from '@ensdomains/ensjs/subgraph'

import { usePrefetchQuery } from '@app/hooks/usePrefetchQuery'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

export type UseSubgraphRecordsParameters = PartialBy<GetSubgraphRecordsParameters, 'name'>

export type UseSubgraphRecordsReturnType = GetSubgraphRecordsReturnType

type UseSubgraphRecordsConfig = QueryConfig<UseSubgraphRecordsReturnType, Error>

type QueryKey<TParams extends UseSubgraphRecordsParameters> = CreateQueryKey<
  TParams,
  'getSubgraphRecords',
  'graph'
>

export const getSubgraphRecordsQueryFn =
  (_config: ConfigWithEns) =>
  async <TParams extends UseSubgraphRecordsParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    // No subgraph: the profile already reads a fixed supported-key set on-chain
    // (see useProfile). We only inject the SNRC-specific text keys so they get
    // fetched too; empty records simply don't render.
    return {
      texts: ['simplex.contact', 'simplex.channel'],
      coins: [],
      contentHash: false,
      isMigrated: true,
      createdAt: undefined,
    } as unknown as GetSubgraphRecordsReturnType
  }

export const useSubgraphRecords = <TParams extends UseSubgraphRecordsParameters>({
  // config
  enabled = true,
  gcTime,
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

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}

export const usePrefetchSubgraphRecords = <TParams extends UseSubgraphRecordsParameters>(
  params: TParams,
) => {
  const initialOptions = useQueryOptions({
    params,
    functionName: 'getSubgraphRecords',
    queryDependencyType: 'graph',
    queryFn: getSubgraphRecordsQueryFn,
  })
  return usePrefetchQuery(initialOptions)
}
