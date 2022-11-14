import {
  ContentHashProtocol,
  encodeContentId,
  getProtocolTypeAndContentId,
} from '@app/utils/contenthash'

type ProtocolOptions = ContentHashProtocol | 'all'

export const validateContentHash =
  (protocol: ProtocolOptions) =>
  (address?: string): string | boolean => {
    if (!address) return true

    const { protocolType, contentId, error } = getProtocolTypeAndContentId(address)
    if (!contentId) return 'Missing content id'
    if (error) return error
    if (protocol !== 'all' && protocolType !== protocol) return 'Invalid protocol type'

    const encoded = encodeContentId(protocolType as ContentHashProtocol, contentId)
    if (encoded.error) return encoded.error
    return true
  }
