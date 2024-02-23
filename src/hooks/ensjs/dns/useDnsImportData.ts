import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import {
  getDnsImportData,
  GetDnsImportDataParameters,
  GetDnsImportDataReturnType,
} from '@ensdomains/ensjs/dns'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'

type UseDnsImportDataParameters = PartialBy<GetDnsImportDataParameters, 'name'>

type UseDnsImportDataReturnType = GetDnsImportDataReturnType

type UseDnsImportDataConfig = QueryConfig<UseDnsImportDataReturnType, Error>

type QueryKey<TParams extends UseDnsImportDataParameters> = CreateQueryKey<
  TParams,
  'getDnsImportData',
  'standard'
>

export const getDnsImportDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseDnsImportDataParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getDnsImportData(client, { name, ...params })
  }

export const useDnsImportData = <TParams extends UseDnsImportDataParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDnsImportDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDnsImportData',
    queryDependencyType: 'standard',
    queryFn: getDnsImportDataQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled:
      enabled &&
      !!params.name &&
      !params.name?.endsWith('.eth') &&
      params.name !== 'eth' &&
      params.name !== '[root]',
    gcTime,
    retry: 2,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
