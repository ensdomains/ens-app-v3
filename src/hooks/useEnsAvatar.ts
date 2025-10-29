import { useQuery } from '@tanstack/react-query'
import { UseEnsAvatarParameters as WagmiUseiEnsAvatarParameters } from 'wagmi'

import { useChainName } from './chain/useChainName'

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

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    return response.ok ? `${imageUrl}?timestamp=${Date.now()}` : null
  } catch (error) {
    return null
  }
}

// TODO: BEFORE Merge, remove query and resolve typescript errors
type UseEnsAvatarParameters = Pick<WagmiUseiEnsAvatarParameters, 'name' | 'query'> & {
  key?: 'avatar' | 'header'
}

export const useEnsAvatar = (params?: UseEnsAvatarParameters) => {
  const chainName = useChainName()
  const url = createMetaDataUrl({ name: params?.name, chainName, mediaKey: params?.key })

  return useQuery({
    queryKey: ['ens-media', url],
    queryFn: checkImageExists,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
