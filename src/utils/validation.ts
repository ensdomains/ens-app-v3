import { isAddress } from 'viem'

const ENS_NAME_REGEX = /^[a-zA-Z0-9-]+\.eth$/
const CONTENT_HASH_REGEX = /^(ipfs|ipns|bzz|onion|onion3|sia|arweave|ar|swarm):\/\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=]+$/

export function validateEnsName(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  return ENS_NAME_REGEX.test(name)
}

export function validateContentHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false
  return CONTENT_HASH_REGEX.test(hash)
}

export function validateEthereumAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false
  return isAddress(address)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#39;'
        case '&': return '&amp;'
        default: return char
      }
    })
}

export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    // Block javascript: URLs and other potentially dangerous protocols
    if (/^(javascript|data|vbscript|file):/i.test(parsed.protocol)) {
      return false
    }
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function validateAvatarUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false
  const sanitizedUri = sanitizeInput(uri)
  if (sanitizedUri.startsWith('data:image/')) {
    return /^data:image\/(jpeg|png|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(sanitizedUri)
  }
  return validateUrl(sanitizedUri)
}
