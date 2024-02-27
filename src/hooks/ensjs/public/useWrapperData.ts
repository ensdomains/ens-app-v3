import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import {
  getWrapperData,
  GetWrapperDataParameters,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseWrapperDataParameters = PartialBy<GetWrapperDataParameters, 'name'>

export type UseWrapperDataReturnType = GetWrapperDataReturnType

type UseWrapperDataConfig = QueryConfig<UseWrapperDataReturnType, Error>

type QueryKey<TParams extends UseWrapperDataParameters> = CreateQueryKey<
  TParams,
  'getWrapperData',
  'standard'
>

export const getWrapperDataQueryFn = async <TParams extends UseWrapperDataParameters>({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getWrapperData(publicClient, { name })
}

export const useWrapperData = <TParams extends UseWrapperDataParameters>({
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
}: TParams & UseWrapperDataConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getWrapperData',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getWrapperDataQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name,
    staleTime,
    onError,
    onSettled,
    onSuccess,
    select: (data) => {
      if (!data) return null
      return {
        ...data,
        expiry: data.expiry
          ? {
              ...data.expiry,
              date: new Date(data.expiry.date),
            }
          : null,
      }
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
