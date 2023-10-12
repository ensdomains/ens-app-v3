import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { namehash, type Address } from 'viem'
import { useQuery } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'

import { useQueryKeyFactory } from './useQueryKeyFactory'

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

export const getResolverExistsQueryFn = async <TParams extends UseResolverExistsParameters>({
  queryKey: [{ name, address }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')
  if (!address) throw new Error('address is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
  const subgraphClient = createSubgraphClient({ client: publicClient })

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
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseResolverExistsConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getResolverExists',
    queryDependencyType: 'graph',
  })

  return useQuery(queryKey, getResolverExistsQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name && !!params.address,
    staleTime,
    onError,
    onSettled,
    onSuccess,
  })
}
