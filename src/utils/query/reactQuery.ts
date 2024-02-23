import { DefaultOptions, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 1_000 * 60 * 5,
      gcTime: 1_000 * 60 * 60 * 24,
    },
  },
})

export const refetchOptions: DefaultOptions<Error> = {
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 120,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: true,
  },
}

export const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})
