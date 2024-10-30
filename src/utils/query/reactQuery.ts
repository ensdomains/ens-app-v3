import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: 0,
      gcTime: 1_000 * 60 * 60 * 24,
      queryKeyHashFn: hashFn,
    },
  },
})

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
