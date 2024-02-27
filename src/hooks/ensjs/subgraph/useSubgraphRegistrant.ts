import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { gql } from 'graphql-request'
import { namehash } from 'viem'
import { Address, useQuery } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'

type UseSubgraphRegistrantParameters = { name: string }

type UseSubgraphRegistrantReturnType = Address | undefined | null

type UseSubgraphRegistrantConfig = QueryConfig<UseSubgraphRegistrantReturnType, Error>

type QueryKey<TParams extends UseSubgraphRegistrantParameters> = CreateQueryKey<
  TParams,
  'getSubgraphRegistrant',
  'graph'
>

type SubgraphResult = {
  domain: {
    registration: {
      registrant: {
        id?: Address
      }
    }
  }
}

export const getSubgraphRegistrantQueryFn = async <
  TParams extends UseSubgraphRegistrantParameters,
>({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
  const subgraphClient = createSubgraphClient({ client: publicClient })
  const query = gql`
    query GetRegistrant($namehash: String!) {
      domain(id: $namehash) {
        registration {
          registrant {
            id
          }
        }
      }
    }
  `
  const result = await subgraphClient.request<SubgraphResult>(query, { namehash: namehash(name) })
  const registrant = result?.domain?.registration?.registrant?.id
  if (!registrant) return null
  return registrant
}

export const useSubgraphRegistrant = <TParams extends UseSubgraphRegistrantParameters>({
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
}: TParams & UseSubgraphRegistrantConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getSubgraphRegistrant',
    queryDependencyType: 'graph',
  })
  return useQuery(queryKey, getSubgraphRegistrantQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name,
    staleTime,
    onError,
    onSettled,
    onSuccess,
  })
}
