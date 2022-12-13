import {
  ContentHashProtocol,
  ContentHashProvider,
  encodeContentId,
  getProtocolTypeAndContentId,
} from '@app/utils/contenthash'

export type ContentHashProviderOrAll = ContentHashProvider | 'all'

const contentHashToProtocols = {
  ipfs: ['ipfs', 'ipns'],
  swarm: ['bzz'],
  onion: ['onion', 'onion3'],
  skynet: ['sia'],
  arweave: ['arweave'],
}

export const validateContentHash =
  (provider: ContentHashProviderOrAll) =>
  (address?: string): string | boolean => {
    if (!address) return true

    const { protocolType, contentId, error } = getProtocolTypeAndContentId(address)
    if (!contentId) return 'Missing content id'
    if (error) return error
    if (provider !== 'all' && !contentHashToProtocols[provider]?.includes(protocolType))
      return 'Invalid protocol type'

    const encoded = encodeContentId(protocolType as ContentHashProtocol, contentId)
    if (encoded.error) return encoded.error
    return true
  }
