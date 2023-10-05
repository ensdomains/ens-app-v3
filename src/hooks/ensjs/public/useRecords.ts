import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import { getRecords, GetRecordsParameters, GetRecordsReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseRecordsParameters = PartialBy<GetRecordsParameters, 'name'>

type UseRecordsConfig<TParams extends UseRecordsParameters> = QueryConfig<
  GetRecordsReturnType<{
    name: string
    records: TParams['records']
    resolver: TParams['resolver']
  }>,
  Error
>

type QueryKey<TParams extends UseRecordsParameters> = CreateQueryKey<
  TParams,
  'getRecords',
  'standard'
>

export const getRecordsQueryFn = async <TParams extends UseRecordsParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  const res = await getRecords(publicClient, { name, ...params })

  if (!res) return null

  return res
}

export const useRecords = <TParams extends UseRecordsParameters>({
  // config
  cacheTime,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseRecordsConfig<TParams>) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getRecordsQueryFn, {
    cacheTime,
    staleTime,
    enabled: enabled && !!params.name,
    onError,
    onSettled,
    onSuccess,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
