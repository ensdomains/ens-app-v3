import { QueryFunctionContext } from '@tanstack/react-query'
import { useQuery } from 'wagmi'

import { isDnsSecEnabled } from '@app/components/pages/import/[name]/utils'
import { CreateQueryKey, QueryConfig } from '@app/types'

import { useQueryKeyFactory } from '../useQueryKeyFactory'

type UseDnsSecEnabledParameters = {
  name?: string | undefined | null
}

type UseDnsSecEnabledReturnType = boolean

type UseDnsSecEnabledConfig = QueryConfig<UseDnsSecEnabledReturnType, Error>

type QueryKey<TParams extends UseDnsSecEnabledParameters> = CreateQueryKey<
  TParams,
  'getDnsSecEnabled',
  'independent'
>

export const getDnsSecEnabledQueryFn = async <TParams extends UseDnsSecEnabledParameters>({
  queryKey: [{ name }],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  return isDnsSecEnabled(name)
}

export const useDnsSecEnabled = <TParams extends UseDnsSecEnabledParameters>({
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
}: TParams & UseDnsSecEnabledConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDnsSecEnabled',
    queryDependencyType: 'independent',
  })

  const query = useQuery(queryKey, getDnsSecEnabledQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name && params.name !== 'eth' && params.name !== '[root]',
    staleTime,
    onError,
    onSettled,
    onSuccess,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
