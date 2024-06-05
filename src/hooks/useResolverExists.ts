import { QueryFunctionContext } from '@tanstack/react-query'
import { namehash, type Address } from 'viem'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

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

const gqlQuery = `
  query getResolverExists($id: String!) {
    resolver(id: $id) {
      id
    }
  }
`

type GraphResponse = {
  resolver?: {
    id: string
  }
}

export const getResolverExistsQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseResolverExistsParameters>({
    queryKey: [{ name, address }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })
    const subgraphClient = createSubgraphClient({ client })

    try {
      const { resolver } = await subgraphClient.request<GraphResponse>(gqlQuery, {
        id: `${address}-${namehash(name)}`,
      })
      return !!resolver
    } catch (e) {
      // If the graph is down or has an error, we assume the resolver exists for safety
      return true
    }
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
