import { useQuery } from '@tanstack/react-query'
import { Hex } from 'viem'
import { usePublicClient } from 'wagmi'

import { resolveReferrerToHex } from '@app/utils/referrer'

type UseResolvedReferrerResult = {
  data: Hex | null
  isLoading: boolean
  isError: boolean
  error: Error | null
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
export const useResolvedReferrer = (
  referrer: string | undefined,
): UseResolvedReferrerResult => {
  const publicClient = usePublicClient()

  const query = useQuery({
    queryKey: ['resolved-referrer', referrer],
    queryFn: async () => {
      if (!publicClient || !referrer) return null
      return resolveReferrerToHex(publicClient, referrer)
    },
    enabled: !!referrer && !!publicClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
