import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { Address, namehash } from 'viem'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'

export type UseSubgraphRegistrantParameters = { name: string }

export type UseSubgraphRegistrantReturnType = Address | undefined | null

export type UseSubgraphRegistrantConfig = QueryConfig<UseSubgraphRegistrantReturnType, Error>

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

export const getSubgraphRegistrantQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseSubgraphRegistrantParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    const client = config.getClient({ chainId })
    const subgraphClient = createSubgraphClient({ client })
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
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseSubgraphRegistrantConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSubgraphRegistrant',
    queryDependencyType: 'graph',
    queryFn: getSubgraphRegistrantQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  return useQuery({
    ...preparedOptions,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })
}
