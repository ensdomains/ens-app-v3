import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Config, useConfig } from 'wagmi'

import { getPrice, GetPriceParameters, GetPriceReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UsePriceParameters = PartialBy<GetPriceParameters, 'nameOrNames'>

type UsePriceReturnType = GetPriceReturnType

type UsePriceConfig = QueryConfig<UsePriceReturnType, Error>

export type UsePriceQueryKey<TParams extends UsePriceParameters> = CreateQueryKey<
  TParams,
  'getPrice',
  'standard'
>

export const getPriceQueryFn =
  (config: Config) =>
  async <TParams extends UsePriceParameters>({
    queryKey: [{ nameOrNames, ...params }, chainId],
  }: QueryFunctionContext<UsePriceQueryKey<TParams>>) => {
    if (!nameOrNames) throw new Error('nameOrNames is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

    return getPrice(publicClient, { nameOrNames, ...params })
  }

export const usePrice = <TParams extends UsePriceParameters>({
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  ...params
}: TParams & UsePriceConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getPrice',
    queryDependencyType: 'standard',
  })

  const config = useConfig()

  const query = useQuery({
    queryKey,
    queryFn: getPriceQueryFn(config),
    gcTime,
    enabled: enabled && !!params.nameOrNames,
    staleTime,
    select: (data: UsePriceReturnType) => {
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
