import { BaseError } from '@ensdomains/ensjs'
import { encodeContentHash, getProtocolType } from '@ensdomains/ensjs/utils'

import { ContentHashProvider } from '@app/utils/contenthash'

export type ContentHashProviderOrAll = ContentHashProvider | 'all'

const contentHashToProtocols = {
  ipfs: ['ipfs', 'ipns'],
  swarm: ['bzz'],
  onion: ['onion', 'onion3'],
  skynet: ['sia'],
  arweave: ['arweave', 'ar'],
}

export const validateContentHash =
  (provider: ContentHashProviderOrAll) =>
  (value?: string): string | boolean => {
    if (!value) return true

    const output = getProtocolType(value)
    if (!output) return 'Invalid protocol type'
    const { protocolType } = output
    if (provider !== 'all' && !contentHashToProtocols[provider]?.includes(protocolType))
      return 'Invalid protocol type'

    try {
      encodeContentHash(value)
      return true
    } catch (e: unknown) {
      if (e instanceof BaseError) return e.message
      return 'Invalid content hash'
    }
  }
