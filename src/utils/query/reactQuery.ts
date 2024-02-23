import { DefaultOptions, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
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
    refetchOnMount: 'always',
  },
}

export const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})
