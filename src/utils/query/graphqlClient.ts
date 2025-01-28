import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

const MAX_QUERY_DEPTH = 10
const MAX_FIELD_COUNT = 50
const ALLOWED_OPERATIONS = ['query', 'subscription']

interface QueryValidationResult {
  isValid: boolean
  error?: string
}

function calculateQueryComplexity(query: string): { depth: number; fieldCount: number } {
  const lines = query.split('\n')
  let maxDepth = 0
  let currentDepth = 0
  let fieldCount = 0

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.includes('{')) {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    }
    if (trimmedLine.includes('}')) {
      currentDepth--
    }
    if (trimmedLine.match(/^[a-zA-Z0-9_]+(\s*{|\s*@|:|\s*$)/)) {
      fieldCount++
    }
  }

  return { depth: maxDepth, fieldCount }
}

function validateOperationType(query: string): boolean {
  const operationMatch = query.match(/^\s*(query|mutation|subscription)\s+/m)
  if (!operationMatch) return true // Default to query
  return ALLOWED_OPERATIONS.includes(operationMatch[1])
}

export function validateGraphQLQuery(query: string): QueryValidationResult {
  if (!validateOperationType(query)) {
    return {
      isValid: false,
      error: 'Only query and subscription operations are allowed',
    }
  }

  const { depth, fieldCount } = calculateQueryComplexity(query)
  
  if (depth > MAX_QUERY_DEPTH) {
    return {
      isValid: false,
      error: `Query depth ${depth} exceeds maximum allowed depth of ${MAX_QUERY_DEPTH}`,
    }
  }

  if (fieldCount > MAX_FIELD_COUNT) {
    return {
      isValid: false,
      error: `Query contains ${fieldCount} fields, exceeding maximum allowed count of ${MAX_FIELD_COUNT}`,
    }
  }

  return { isValid: true }

export function createGraphQLQueryClient(baseOptions: DefaultOptions<Error>) {
  return new QueryClient({
    defaultOptions: {
      ...baseOptions,
      queries: {
        ...baseOptions.queries,
        queryFn: async (context: any) => {
          if (context.queryKey[context.queryKey.length - 1] === 'graph') {
            const query = context.queryKey[1]
            const validationResult = validateGraphQLQuery(query)
            if (!validationResult.isValid) {
              throw new Error(`GraphQL validation failed: ${validationResult.error}`)
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
