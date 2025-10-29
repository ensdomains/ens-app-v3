import { UseEnsAvatarParameters as WagmiUseiEnsAvatarParameters } from 'wagmi'

import { useChainName } from './chain/useChainName'
import { useImgTimestamp } from './useImgTimestamp'

const createMetaDataUrl = ({
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

type UseEnsAvatarParameters = Pick<WagmiUseiEnsAvatarParameters, 'name'> & {
  key: 'avatar' | 'header'
}

export const useEnsAvatar = (params?: UseEnsAvatarParameters) => {
  const { addTimestamp } = useImgTimestamp()

  const chainName = useChainName()
  const url = createMetaDataUrl({ name: params?.name, chainName, mediaKey: params?.key })
  const avatarUrl = addTimestamp(url)

  return {
    data: avatarUrl,
  }
}
