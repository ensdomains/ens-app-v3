import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { Config } from 'wagmi'

import { getPrice, GetPriceParameters, GetPriceReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UsePriceParameters = PartialBy<GetPriceParameters, 'nameOrNames'>

type UsePriceReturnType = GetPriceReturnType

type UsePriceConfig = QueryConfig<UsePriceReturnType, Error>

type QueryKey<TParams extends UsePriceParameters> = CreateQueryKey<TParams, 'getPrice', 'standard'>

export const getPriceQueryFn =
  (config: Config) =>
  async <TParams extends UsePriceParameters>({
    queryKey: [{ nameOrNames, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!nameOrNames) throw new Error('nameOrNames is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

    return getPrice(publicClient, { nameOrNames, ...params })
  }

export const usePrice = <TParams extends UsePriceParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UsePriceConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getPrice',
    queryDependencyType: 'standard',
    queryFn: getPriceQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.nameOrNames,
    gcTime,
    staleTime,
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
