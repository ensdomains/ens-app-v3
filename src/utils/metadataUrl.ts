/**
 * ENS Metadata URL utilities
 *
 * This module provides utilities for constructing metadata service URLs.
 * Extracted to break dependency cycle between useEnsAvatar and metadataCache.
 */

export const META_DATA_BASE_URL = 'https://metadata.ens.domains'

/**
 * Creates a metadata service URL for ENS names
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @param chainName - Chain name (e.g., 'mainnet', 'sepolia')
 * @param mediaKey - Media type ('avatar' or 'header')
 * @returns Metadata service URL or null if invalid parameters
 */
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
  return `${META_DATA_BASE_URL}/${chainName}/${mediaKey}/${name}`
}
