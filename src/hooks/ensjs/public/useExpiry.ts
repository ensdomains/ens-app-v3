import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import { getExpiry, GetExpiryParameters, GetExpiryReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'

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
  gcTime = 60,
  enabled = true,
  staleTime,
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
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.name,
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
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
