import { QueryClient } from '@tanstack/react-query'

import { META_DATA_QUERY_KEY } from '@app/hooks/useEnsAvatar'
import { setCacheBustExpiry } from '@app/utils/metadataCache'
import { createMetaDataUrl } from '@app/utils/metadataUrl'

/**
 * Invalidates ENS metadata queries and injects cache-busting timestamps
 *
 * @param queryClient - React Query client instance
 * @param options - Optional filters for specific name/mediaKey
 */
export const invalidateMetaDataQuery = async (
  queryClient: QueryClient,
  options?: {
    name?: string
    chainName?: string
    mediaKey?: 'avatar' | 'header'
  },
) => {
  const timestamp = Date.now()

  if (options?.name && options?.chainName && options?.mediaKey) {
    // Specific query invalidation
    const url = createMetaDataUrl({
      name: options.name,
      chainName: options.chainName,
      mediaKey: options.mediaKey,
    })

    if (url) {
      // Store the expiry for this URL
      setCacheBustExpiry(url, timestamp)

      const queryKey = [META_DATA_QUERY_KEY, url] as const

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      })
    }
  } else {
    // Bulk invalidation
    // Note: Cache-busting expiries are set in transaction files for specific media updates.
    // This bulk invalidation only triggers React Query refetches without setting expiries,
    // allowing unchanged images to be fetched from cache normally.
    await queryClient.invalidateQueries({
      queryKey: [META_DATA_QUERY_KEY],
      refetchType: 'active',
    })
  }
}
