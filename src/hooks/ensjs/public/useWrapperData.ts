import { QueryFunctionContext } from '@tanstack/react-query'

import {
  getWrapperData,
  GetWrapperDataParameters,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseWrapperDataParameters = PartialBy<GetWrapperDataParameters, 'name'>

export type UseWrapperDataReturnType = GetWrapperDataReturnType

type UseWrapperDataConfig = QueryConfig<UseWrapperDataReturnType, Error>

export type UseWrapperDataQueryKey<
  TParams extends UseWrapperDataParameters = UseWrapperDataParameters,
> = CreateQueryKey<TParams, 'getWrapperData', 'standard'>

export const getWrapperDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseWrapperDataParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<UseWrapperDataQueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getWrapperData(client, { name })
  }

export const useWrapperData = <TParams extends UseWrapperDataParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseWrapperDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getWrapperData',
    queryDependencyType: 'standard',
    queryFn: getWrapperDataQueryFn,
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
