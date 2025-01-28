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

import { validateContentHash as validateContentHashUtil, sanitizeInput } from '../utils/validation'

export const validateContentHash =
  (provider: ContentHashProviderOrAll) =>
  (value?: string): string | boolean => {
    if (!value) return true

    const sanitizedValue = sanitizeInput(value)
    if (!validateContentHashUtil(sanitizedValue)) {
      return 'Invalid content hash format'
    }

    const output = getProtocolType(sanitizedValue)
    if (!output) return 'Invalid protocol type'
    const { protocolType, decoded } = output
    if (provider !== 'all' && !contentHashToProtocols[provider]?.includes(protocolType))
      return 'Invalid protocol type'

    if (
      (['ipfs', 'bzz'].includes(protocolType) && decoded.length < 4) ||
      (protocolType === 'onion' && decoded.length !== 16) ||
      (protocolType === 'onion3' && decoded.length !== 56) ||
      (protocolType === 'sia' && decoded.length !== 46) ||
      (['arweave', 'ar'].includes(protocolType) && decoded.length !== 43)
    )
      return 'Invalid content id'

    try {
      encodeContentHash(sanitizedValue)
      return true
    } catch (e: unknown) {
      if (e instanceof BaseError) return e.message
      return 'Invalid content hash'
    }
  }
