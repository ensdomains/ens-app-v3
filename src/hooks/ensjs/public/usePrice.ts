import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import { getPrice, GetPriceParameters, GetPriceReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UsePriceParameters = PartialBy<GetPriceParameters, 'nameOrNames'>

type UsePriceReturnType = GetPriceReturnType

type UsePriceConfig = QueryConfig<UsePriceReturnType, Error>

type QueryKey<TParams extends UsePriceParameters> = CreateQueryKey<TParams, 'getPrice', 'standard'>

export const getPriceQueryFn = async <TParams extends UsePriceParameters>({
  queryKey: [{ nameOrNames, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!nameOrNames) throw new Error('nameOrNames is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getPrice(publicClient, { nameOrNames, ...params })
}

export const usePrice = <TParams extends UsePriceParameters>({
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
}: TParams & UsePriceConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getPrice',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getPriceQueryFn, {
    cacheTime,
    enabled: enabled && !!params.nameOrNames,
    staleTime,
    onError,
    onSettled,
    onSuccess,
    select: (data) => {
      if (!data) return data
      return {
        base: BigInt(data.base),
        premium: BigInt(data.premium),
      }
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
