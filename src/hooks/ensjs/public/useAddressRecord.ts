import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import {
  getAddressRecord,
  GetAddressRecordParameters,
  GetAddressRecordReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'

type UseAddressRecordParameters = PartialBy<GetAddressRecordParameters, 'name'>

type UseAddressRecordReturnType = GetAddressRecordReturnType

type UseAddressRecordConfig = QueryConfig<UseAddressRecordReturnType, Error>

type QueryKey<TParams extends UseAddressRecordParameters> = CreateQueryKey<
  TParams,
  'getAddressRecord',
  'standard'
>

export const getAddressRecordQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseAddressRecordParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getAddressRecord(client, { name, ...params })
  }

export const useAddressRecord = <TParams extends UseAddressRecordParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime = 1_000 * 60 * 5,
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

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
  })

  const query = useQuery({
    ...preparedOptions,
    gcTime,
    staleTime,
  })

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
