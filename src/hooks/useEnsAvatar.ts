import { UseEnsAvatarParameters, useEnsAvatar as useWagmiEnsAvatar } from 'wagmi'

import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { validateImageUri } from '@app/validators/validateImageUri'

import { useImgTimestamp } from './useImgTimestamp'

export const useEnsAvatar = (params?: UseEnsAvatarParameters) => {
  const { addTimestamp } = useImgTimestamp()

  const result = useWagmiEnsAvatar({
    ...ensAvatarConfig,
    ...params,
  })

  const avatarUrl = addTimestamp(result.data)

  const validUrl = validateImageUri(avatarUrl)
  const isValidUrl = avatarUrl && validUrl === true
  const validUrlError = typeof validUrl === 'string' ? validUrl : undefined

  return {
    ...result,
    data: isValidUrl ? avatarUrl : null,
    error: isValidUrl ? undefined : validUrlError,
    isError: !isValidUrl,
  }
}
