import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import { getExpiry, GetExpiryParameters, GetExpiryReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'

type UseExpiryParameters = PartialBy<GetExpiryParameters, 'name'>

type UseExpiryReturnType = GetExpiryReturnType

type UseExpiryConfig = QueryConfig<UseExpiryReturnType, Error>

export type UseExpiryQueryKey<TParams extends UseExpiryParameters> = CreateQueryKey<
  TParams,
  'getExpiry',
  'standard'
>

export const getExpiryQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseExpiryParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<UseExpiryQueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getExpiry(client, { name, ...params })
  }

export const useExpiry = <TParams extends UseExpiryParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime = 1_000 * 60 * 5,
  scopeKey,
  // params
  ...params
}: TParams & UseExpiryConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getExpiry',
    queryDependencyType: 'standard',
    queryFn: getExpiryQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
  })

  const query = useQuery({
    ...preparedOptions,
    gcTime,
    staleTime,
    select: (data) => {
      if (!data) return null
      return {
        ...data,
        expiry: {
          ...data.expiry,
          date: new Date(data.expiry.date),
        },
      }
    },
  })

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
