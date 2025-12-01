import { useQuery, UseQueryOptions } from '@tanstack/react-query'

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

const checkImageExists = async ({
  queryKey: [, imageUrl],
}: {
  queryKey: [string, string | null]
}): Promise<null | string> => {
  if (!imageUrl) return null

  const imageUrlWithTimestamp = `${imageUrl}?timestamp=${Date.now()}`
  try {
    const response = await fetch(imageUrlWithTimestamp, { method: 'HEAD' })
    return response.ok ? imageUrlWithTimestamp : null
  } catch {
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
