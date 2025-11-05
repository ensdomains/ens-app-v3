import { createMetaDataUrl } from '@app/hooks/useEnsAvatar'
import type { ClientWithEns } from '@app/types'

import { getChainNameForClient } from './getChainNameForClient'
import { setCacheBustExpiry } from './metadataCache'

/**
 * Busts the cache for an avatar image
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @param client - Viem client with chain information
 */
export const bustAvatarCache = (name: string, client: ClientWithEns) => {
  const timestamp = Date.now()
  const chainName = getChainNameForClient(client)
  const avatarUrl = createMetaDataUrl({ name, chainName, mediaKey: 'avatar' })

  if (avatarUrl) {
    setCacheBustExpiry(avatarUrl, timestamp)
    console.log(`[Cache Bust] Avatar for ${name} on ${chainName}:`, avatarUrl)
  }
}

/**
 * Busts the cache for a header image
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @param client - Viem client with chain information
 */
export const bustHeaderCache = (name: string, client: ClientWithEns) => {
  const timestamp = Date.now()
  const chainName = getChainNameForClient(client)
  const headerUrl = createMetaDataUrl({ name, chainName, mediaKey: 'header' })

  if (headerUrl) {
    setCacheBustExpiry(headerUrl, timestamp)
    console.log(`[Cache Bust] Header for ${name} on ${chainName}:`, headerUrl)
  }
}

/**
 * Busts the cache for both avatar and header images
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @param client - Viem client with chain information
 */
export const bustMediaCache = (name: string, client: ClientWithEns) => {
  bustAvatarCache(name, client)
  bustHeaderCache(name, client)
}
