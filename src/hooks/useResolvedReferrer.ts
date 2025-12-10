import { QueryFunctionContext } from '@tanstack/react-query'
import { Hex } from 'viem'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'
import { resolveReferrer } from '@app/utils/referrer'

type UseResolvedReferrerParameters = {
  referrer?: string
}

type UseResolvedReferrerReturnType = Hex | null

type UseResolvedReferrerConfig = QueryConfig<UseResolvedReferrerReturnType, Error>

type UseResolvedReferrerQueryKey<
  TParams extends UseResolvedReferrerParameters = UseResolvedReferrerParameters,
> = CreateQueryKey<TParams, 'resolveReferrer', 'standard'>

const resolveReferrerQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseResolvedReferrerParameters>({
    queryKey: [{ referrer }, chainId],
  }: QueryFunctionContext<UseResolvedReferrerQueryKey<TParams>>) => {
    if (!referrer) return null

    const client = config.getClient({ chainId })
    return resolveReferrer(client, referrer)
  }

/**
 * Hook to resolve a referrer (ENS name or hex address) to a 32-byte hex value.
 *
 * For ENS names, attempts to:
 * 1. Get ETH address record from the name
 * 2. Fall back to owner/registrant if no address record
 * 3. Convert resolved address to 32-byte hex
 *
 * @param referrer - ENS name or hex address to resolve
 * @returns Query result with resolved hex value
 */
export const useResolvedReferrer = <TParams extends UseResolvedReferrerParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseResolvedReferrerConfig): {
  data: UseResolvedReferrerReturnType
  isLoading: boolean
  isError: boolean
  error: Error | null
} => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'resolveReferrer',
    queryDependencyType: 'standard',
    queryFn: resolveReferrerQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.referrer,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
