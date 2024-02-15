import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import {
  getDnsImportData,
  GetDnsImportDataParameters,
  GetDnsImportDataReturnType,
} from '@ensdomains/ensjs/dns'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseDnsImportDataParameters = PartialBy<GetDnsImportDataParameters, 'name'>

type UseDnsImportDataReturnType = GetDnsImportDataReturnType

type UseDnsImportDataConfig = QueryConfig<UseDnsImportDataReturnType, Error>

type QueryKey<TParams extends UseDnsImportDataParameters> = CreateQueryKey<
  TParams,
  'getDnsImportData',
  'standard'
>

export const getDnsImportDataQueryFn = async <TParams extends UseDnsImportDataParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getDnsImportData(publicClient, { name, ...params })
}

export const useDnsImportData = <TParams extends UseDnsImportDataParameters>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseDnsImportDataConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDnsImportData',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getDnsImportDataQueryFn, {
    cacheTime,
    enabled:
      enabled &&
      !!params.name &&
      !params.name?.endsWith('.eth') &&
      params.name !== 'eth' &&
      params.name !== '[root]',
    staleTime,
    onError,
    onSettled,
    onSuccess,
    retry: 2,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
