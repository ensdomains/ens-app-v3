import { QueryFunctionContext, useQuery , useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import {
  getAddressRecord,
  GetAddressRecordParameters,
  GetAddressRecordReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseAddressRecordParameters = PartialBy<GetAddressRecordParameters, 'name'>

type UseAddressRecordReturnType = GetAddressRecordReturnType

type UseAddressRecordConfig = QueryConfig<UseAddressRecordReturnType, Error>

type QueryKey<TParams extends UseAddressRecordParameters> = CreateQueryKey<
  TParams,
  'getAddressRecord',
  'standard'
>

export const getAddressRecordQueryFn = async <TParams extends UseAddressRecordParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getAddressRecord(publicClient, { name, ...params })
}

export const useAddressRecord = <TParams extends UseAddressRecordParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
 
  // params
  ...params
}: TParams & UseAddressRecordConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getAddressRecord',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getAddressRecordQueryFn, {
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,

  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
