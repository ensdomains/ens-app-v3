import { QueryFunctionContext } from '@tanstack/react-query'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseSubgraphMetaParameters = {}

type UseSubgraphMetaReturnType = {
  hasIndexingErrors: boolean
  blockNumber: number
}

type UseSubgraphMetaConfig = QueryConfig<UseSubgraphMetaReturnType, Error>

export type QueryKey<TParams extends UseSubgraphMetaParameters> = CreateQueryKey<
  TParams,
  'getSubgraphMeta',
  'graph'
>

export const getSubgraphMetaQueryFn =
  (
    config: ConfigWithEns, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) =>
  async <TParams extends UseSubgraphMetaParameters>(
    context: QueryFunctionContext<QueryKey<TParams>>, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<UseSubgraphMetaReturnType> => {
    // Subgraph removed: report a healthy, fully-synced stub so any
    // "out of sync / indexing" banner never renders.
    return {
      hasIndexingErrors: false,
      blockNumber: Number.MAX_SAFE_INTEGER,
    }
  }

export const useSubgraphMeta = <TParams extends UseSubgraphMetaParameters>(
  args = {} as TParams & UseSubgraphMetaConfig,
) => {
  const {
    // config
    enabled = true,
    gcTime,
    staleTime,
    scopeKey,
  } = args

  const initialOptions = useQueryOptions({
    params: {},
    scopeKey,
    functionName: 'getSubgraphMeta',
    queryDependencyType: 'graph',
    queryFn: getSubgraphMetaQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled,
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
