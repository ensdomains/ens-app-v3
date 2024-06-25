import { QueryFunctionContext } from '@tanstack/react-query'
import { gql } from 'graphql-request'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

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
  (config: ConfigWithEns) =>
  async <TParams extends UseSubgraphMetaParameters>({
    queryKey: [, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    const client = config.getClient({ chainId })
    const subgraphClient = createSubgraphClient({ client })
    const query = gql`
      query getMeta {
        _meta {
          hasIndexingErrors
          block {
            number
          }
        }
      }
    `
    const result = await subgraphClient.request<{
      _meta: { hasIndexingErrors: boolean; block: { number: number } }
    }>(query)

    return {
      hasIndexingErrors: result._meta.hasIndexingErrors,
      blockNumber: result._meta.block.number,
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
