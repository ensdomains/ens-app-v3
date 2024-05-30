import { QueryFunctionContext } from '@tanstack/react-query'

import {
  getAddressRecord,
  GetAddressRecordParameters,
  GetAddressRecordReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseAddressRecordParameters = PartialBy<GetAddressRecordParameters, 'name'>

export type UseAddressRecordReturnType = GetAddressRecordReturnType

type UseAddressRecordConfig = QueryConfig<UseAddressRecordReturnType, Error>

export type UseAddressRecordQueryKey<
  TParams extends UseAddressRecordParameters = UseAddressRecordParameters,
> = CreateQueryKey<TParams, 'getAddressRecord', 'standard'>

export const getAddressRecordQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseAddressRecordParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<UseAddressRecordQueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getAddressRecord(client, { name, ...params })
  }

export const useAddressRecord = <TParams extends UseAddressRecordParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseAddressRecordConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getAddressRecord',
    queryDependencyType: 'standard',
    queryFn: getAddressRecordQueryFn,
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
