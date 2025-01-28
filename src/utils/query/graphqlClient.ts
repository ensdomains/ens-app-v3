import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

const MAX_QUERY_DEPTH = 10

function calculateQueryDepth(query: string): number {
  const lines = query.split('\n')
  let maxDepth = 0
  let currentDepth = 0

  for (const line of lines) {
    if (line.includes('{')) {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    }
    if (line.includes('}')) {
      currentDepth--
    }
  }

  return maxDepth
}

export function validateGraphQLQuery(query: string): boolean {
  const depth = calculateQueryDepth(query)
  return depth <= MAX_QUERY_DEPTH
}

export function createGraphQLQueryClient(baseOptions: DefaultOptions<Error>) {
  return new QueryClient({
    defaultOptions: {
      ...baseOptions,
      queries: {
        ...baseOptions.queries,
        queryFn: async (context: any) => {
          if (context.queryKey[context.queryKey.length - 1] === 'graph') {
            const query = context.queryKey[1]
            if (!validateGraphQLQuery(query)) {
              throw new Error('Query exceeds maximum allowed depth')
            }
          }
          return baseOptions.queries?.queryFn?.(context)
        },
        retry: (failureCount, error: any) => {
          if (error?.message?.includes('Query exceeds maximum allowed depth')) {
            return false
          }
          return failureCount < 3
        },
        queryKeyHashFn: hashFn,
      },
    },
  })
}
