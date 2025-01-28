import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

import { createGraphQLQueryClient } from './graphqlClient'

const baseOptions: DefaultOptions<Error> = {
  queries: {
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 1_000 * 60 * 60 * 24,
    queryKeyHashFn: hashFn,
  },
}

export const queryClient = createGraphQLQueryClient(baseOptions)

export const refetchOptions: DefaultOptions<Error> = {
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime: 0,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: true,
    queryKeyHashFn: hashFn,
  },
}

export const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})
