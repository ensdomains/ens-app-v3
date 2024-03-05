import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import {
  getWrapperData,
  GetWrapperDataParameters,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'

type UseWrapperDataParameters = PartialBy<GetWrapperDataParameters, 'name'>

type UseWrapperDataReturnType = GetWrapperDataReturnType

type UseWrapperDataConfig = QueryConfig<UseWrapperDataReturnType, Error>

type QueryKey<TParams extends UseWrapperDataParameters> = CreateQueryKey<
  TParams,
  'getWrapperData',
  'standard'
>

export const getWrapperDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseWrapperDataParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getWrapperData(client, { name })
  }

export const useWrapperData = <TParams extends UseWrapperDataParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime = 1_000 * 60 * 5,
  scopeKey,
  // params
  ...params
}: TParams & UseWrapperDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getWrapperData',
    queryDependencyType: 'standard',
    queryFn: getWrapperDataQueryFn,
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
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
