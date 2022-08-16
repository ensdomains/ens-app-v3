import { DecodedContentHash } from '@ensdomains/ensjs/dist/cjs/utils/contentHash'

export const getContentHashLink = (
  name: string,
  network: number,
  decodedContentHash: DecodedContentHash,
) => {
  const protocol = decodedContentHash.protocolType
  const hash = decodedContentHash.decoded

  const useEthLink =
    name.endsWith('.eth') && network === 1 && (protocol === 'ipfs' || protocol === 'ipns')
  if (useEthLink) {
    return `https://${name}.link`
  }

  if (protocol === 'ipfs') {
    return `https://cloudflare-ipfs.com/ipfs/${hash}` // using ipfs's secured origin gateway
  }
  if (protocol === 'ipns') {
    return `https://cloudflare-ipfs.com/ipns/${hash}`
  }
  if (protocol === 'bzz') {
    return `https://gateway.ethswarm.org/bzz/${hash}`
  }
  if (protocol === 'onion' || protocol === 'onion3') {
    return `http://${hash}.onion`
  }
  if (protocol === 'sia') {
    return `https://siasky.net/${hash}`
  }
  if (protocol === 'arweave') {
    return `https://arweave.net/${hash}`
  }
  return null
}

export const contentHashToString = (
  contentHash: string | DecodedContentHash | undefined | null,
): string => {
  if (typeof contentHash === 'string') return contentHash
  if (typeof contentHash === 'object' && contentHash?.decoded && contentHash?.protocolType)
    return `${contentHash.protocolType}://${contentHash.decoded}`
  return ''
}
