import { UseEnsAvatarParameters, useEnsAvatar as useWagmiEnsAvatar } from 'wagmi'

import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { validateImageUri } from '@app/validators/validateImageUri'

import { useImgTimestamp } from './useImgTimestamp'
import { useValidateImageFromSource } from './useValidateFileTypeFromSource'

export const useEnsAvatar = (params?: UseEnsAvatarParameters) => {
  const { addTimestamp } = useImgTimestamp()

  const result = useWagmiEnsAvatar({
    ...ensAvatarConfig,
    ...params,
  })

  const avatarUrl = addTimestamp(result.data)

  const validContentType = useValidateImageFromSource(avatarUrl, !!avatarUrl)

  const validUrl = validateImageUri(avatarUrl)
  const isValidUrl = validUrl === true
  const validUrlError = typeof validUrl === 'string' ? validUrl : undefined

  return {
    ...result,
    data: avatarUrl && validContentType.isValid && isValidUrl ? avatarUrl : undefined,
    error: validContentType.error ?? result.error ?? validUrlError,
    isError: !!(validContentType.error || result.error || validUrlError),
  }
}
