import { ContentHashIconType } from '@app/assets/contentHash/DynamicContentHashIcon'
import {
  ContentHashProtocol,
  encodeContentId,
  getProtocolTypeAndContentId,
} from '@app/utils/contenthash'

type ContentHashOption = ContentHashIconType | 'all'

const contentHashToProtocols = {
  ipfs: ['ipfs', 'ipns'],
  swarm: ['bzz'],
  onion: ['onion', 'onion3'],
  skynet: ['sia'],
  arweave: ['arweave'],
}

export const validateContentHash =
  (contentHashOption: ContentHashOption) =>
  (address?: string): string | boolean => {
    if (!address) return true

    const { protocolType, contentId, error } = getProtocolTypeAndContentId(address)
    if (!contentId) return 'Missing content id'
    if (error) return error
    if (
      contentHashOption !== 'all' &&
      !contentHashToProtocols[contentHashOption]?.includes(protocolType)
    )
      return 'Invalid protocol type'
    console.log(protocolType, contentId)
    const encoded = encodeContentId(protocolType as ContentHashProtocol, contentId)
    if (encoded.error) return encoded.error
    return true
  }
