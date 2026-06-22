import { QueryFunctionContext } from '@tanstack/react-query'
import { type Address } from 'viem'

import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

import { useQueryOptions } from './useQueryOptions'

type UseResolverExistsParameters = {
  name?: string | undefined | null
  address?: Address | undefined | null
}

type UseResolverExistsReturnType = boolean

type UseResolverExistsConfig = QueryConfig<UseResolverExistsReturnType, Error>

type QueryKey<TParams extends UseResolverExistsParameters> = CreateQueryKey<
  TParams,
  'getResolverExists',
  'graph'
>

export const getResolverExistsQueryFn =
  (_config: ConfigWithEns) =>
  async <TParams extends UseResolverExistsParameters>({
    queryKey: [{ name, address }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    if (!address) throw new Error('address is required')
    // No subgraph: this only gates whether the registration flow pre-clears prior
    // records on the given resolver. SNRC names are freshly registered with no
    // pre-existing records, so report none.
    return false
  }

/**
 * Check if a resolver exists for a given name. Used in registration to check if the
 * public resolver needs to have it's records cleared.
 */
export const useResolverExists = <TParams extends UseResolverExistsParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseResolverExistsConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getResolverExists',
    queryDependencyType: 'graph',
    queryFn: getResolverExistsQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && !!params.address,
    gcTime,
    staleTime,
  })

  return useQuery(preparedOptions)
}
