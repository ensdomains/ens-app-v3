import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { getCacheBustTimestamp } from '@app/utils/metadataCache'

import { useChainName } from './chain/useChainName'

export const META_DATA_QUERY_KEY = 'ensMetaData'

export const createMetaDataUrl = ({
  name,
  chainName,
  mediaKey = 'avatar',
}: {
  name?: string
  chainName: string
  mediaKey?: 'avatar' | 'header'
}): string | null => {
  if (!name || !chainName || !mediaKey) return null
  return `https://metadata.ens.domains/${chainName}/${mediaKey}/${name}`
}

const checkImageExists = async (
  context: QueryFunctionContext<[string, string | null]>,
): Promise<null | string> => {
  const [, imageUrl] = context.queryKey
  if (!imageUrl) return null

  // Append timestamp if present for cache-busting
  const cacheBustTimestamp = getCacheBustTimestamp(imageUrl)
  const imageUrlWithTimestamp = cacheBustTimestamp
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${cacheBustTimestamp}`
    : imageUrl

  try {
    const response = await fetch(imageUrlWithTimestamp, { method: 'GET' })
    return response.ok ? imageUrlWithTimestamp : null
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
    staleTime: staleTime ?? 15 * 60 * 1000, // 15 minutes
    enabled: enabled && !!url,
  })
}
