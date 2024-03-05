import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import { getPrice, GetPriceParameters, GetPriceReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'

type UsePriceParameters = PartialBy<GetPriceParameters, 'nameOrNames'>

type UsePriceReturnType = GetPriceReturnType

type UsePriceConfig = QueryConfig<UsePriceReturnType, Error>

type QueryKey<TParams extends UsePriceParameters> = CreateQueryKey<TParams, 'getPrice', 'standard'>

export const getPriceQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UsePriceParameters>({
    queryKey: [{ nameOrNames, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!nameOrNames) throw new Error('nameOrNames is required')

    const client = config.getClient({ chainId })

    return getPrice(client, { nameOrNames, ...params })
  }

export const usePrice = <TParams extends UsePriceParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime = 1_000 * 60 * 5,
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
    enabled: enabled && !!params.nameOrNames,
  })

  const query = useQuery({
    ...preparedOptions,
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
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
