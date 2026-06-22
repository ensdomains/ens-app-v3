import { QueryFunctionContext } from '@tanstack/react-query'

import { GetNameHistoryParameters, GetNameHistoryReturnType } from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseNameHistoryParameters = PartialBy<GetNameHistoryParameters, 'name'>

type UseNameHistoryReturnType = GetNameHistoryReturnType

type UseNameHistoryConfig = QueryConfig<UseNameHistoryReturnType, Error>

type QueryKey<TParams extends UseNameHistoryParameters> = CreateQueryKey<
  TParams,
  'getNameHistory',
  'graph'
>

export const getNameHistoryQueryFn =
  (
    config: ConfigWithEns, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) =>
  async <TParams extends UseNameHistoryParameters>(
    context: QueryFunctionContext<QueryKey<TParams>>, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<GetNameHistoryReturnType> => {
    // Subgraph removed: no name history available.
    return null
  }

export const useNameHistory = <TParams extends UseNameHistoryParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseNameHistoryConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getNameHistory',
    queryDependencyType: 'graph',
    queryFn: getNameHistoryQueryFn,
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
