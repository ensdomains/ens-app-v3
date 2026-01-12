import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { getCacheBustExpiry, TTL_MS } from '@app/utils/metadataCache'
import { createMetaDataUrl } from '@app/utils/metadataUrl'

import { useChainName } from './chain/useChainName'

export const META_DATA_QUERY_KEY = 'ensMetaData'

const STALE_TIME = TTL_MS + 10 * 60 * 1000 // Metadata cache expirty time plus 10 minutes for transaction time

const checkImageExists = async (
  context: QueryFunctionContext<[string, string | null]>,
): Promise<null | string> => {
  const [, imageUrl] = context.queryKey
  if (!imageUrl) return null

  // Append expiry if present for cache-busting
  const cacheBustExpiry = getCacheBustExpiry(imageUrl)
  const imageUrlWithExpiry = cacheBustExpiry ? `${imageUrl}?expiry=${cacheBustExpiry}` : imageUrl

  try {
    const response = await fetch(imageUrlWithExpiry, { method: 'GET' })
    return response.ok ? imageUrlWithExpiry : null
  } catch (error) {
    return null
  }
}

type UseEnsAvatarParameters = Omit<UseQueryOptions, 'queryFn' | 'queryKey'> & {
  name?: string
  key?: 'avatar' | 'header'
}

export const useEnsAvatar = ({ name, key, staleTime, enabled = true }: UseEnsAvatarParameters) => {
  const chainName = useChainName()
  const url = createMetaDataUrl({ name, chainName, mediaKey: key })

  return useQuery({
    queryKey: [META_DATA_QUERY_KEY, url],
    queryFn: checkImageExists,
    staleTime: staleTime ?? STALE_TIME,
    enabled: enabled && !!url,
  })
}
