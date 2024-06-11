import { QueryFunctionContext } from '@tanstack/react-query'

import { getResolver, GetResolverParameters, GetResolverReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseResolverParameters = PartialBy<GetResolverParameters, 'name'>

type UseResolverReturnType = GetResolverReturnType

type UseResolverConfig = QueryConfig<UseResolverReturnType, Error>

type QueryKey<TParams extends UseResolverParameters> = CreateQueryKey<
  TParams,
  'getResolver',
  'standard'
>

export const getResolverQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseResolverParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getResolver(client, { name })
  }

export const useResolver = <TParams extends UseResolverParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseResolverConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getResolver',
    queryDependencyType: 'standard',
    queryFn: getResolverQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
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
