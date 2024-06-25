import { QueryFunctionContext } from '@tanstack/react-query'

import { getPrice, GetPriceParameters, GetPriceReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UsePriceParameters = PartialBy<GetPriceParameters, 'nameOrNames'>

type UsePriceReturnType = GetPriceReturnType

type UsePriceConfig = QueryConfig<UsePriceReturnType, Error>

export type UsePriceQueryKey<TParams extends UsePriceParameters = UsePriceParameters> =
  CreateQueryKey<TParams, 'getPrice', 'standard'>

export const getPriceQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UsePriceParameters>({
    queryKey: [{ nameOrNames, ...params }, chainId],
  }: QueryFunctionContext<UsePriceQueryKey<TParams>>) => {
    if (!nameOrNames) throw new Error('nameOrNames is required')

    const client = config.getClient({ chainId })

    return getPrice(client, { nameOrNames, ...params })
  }

export const usePrice = <TParams extends UsePriceParameters>({
  // config
  enabled = true,
  gcTime,
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

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.nameOrNames,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
