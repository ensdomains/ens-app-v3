import { QueryClient } from '@tanstack/react-query'

import { createMetaDataUrl, META_DATA_QUERY_KEY } from '@app/hooks/useEnsAvatar'
import { setCacheBustTimestamp } from '@app/utils/metadataCache'

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
      // Store the timestamp for this URL
      setCacheBustTimestamp(url, timestamp)

      const queryKey = [META_DATA_QUERY_KEY, url] as const

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      })
    }
  } else {
    // Bulk invalidation - update all matching queries
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll().filter((query) => query.queryKey[0] === META_DATA_QUERY_KEY)

    // Set timestamps for all metadata URLs
    queries.forEach((query) => {
      const url = query.queryKey[1] as string | null
      if (url) {
        setCacheBustTimestamp(url, timestamp)
      }
    })

    // Invalidate all metadata queries
    await queryClient.invalidateQueries({
      queryKey: [META_DATA_QUERY_KEY],
      refetchType: 'active',
    })
  }
}
