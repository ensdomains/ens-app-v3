import { utils } from 'ethers'

import contentHash from '@ensdomains/content-hash'
import { DecodedContentHash } from '@ensdomains/ensjs/utils/contentHash'

type EncodedContentHash = {
  encoded?: string
  error?: string
}

export type ContentHashProtocol = 'ipfs' | 'ipns' | 'bzz' | 'onion' | 'onion3' | 'sia' | 'arweave'

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
  hash: string | DecodedContentHash | undefined | null,
): string => {
  if (typeof hash === 'string') return hash
  if (typeof hash === 'object' && hash?.decoded && hash?.protocolType)
    return `${hash.protocolType}://${hash.decoded}`
  return ''
}

const supportedCodecs = [
  'ipns-ns',
  'ipfs-ns',
  'swarm-ns',
  'onion',
  'onion3',
  'skynet-ns',
  'arweave-ns',
]

const matchProtocol = (text: string) => {
  return (
    text.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave):\/\/(.*)/) ||
    text.match(/\/(ipfs)\/(.*)/) ||
    text.match(/\/(ipns)\/(.*)/)
  )
}

export const decodeContenthash = (encodedObjOrString?: EncodedContentHash | string) => {
  let decoded
  let protocolType
  let error

  let encoded =
    typeof encodedObjOrString === 'string' ? encodedObjOrString : encodedObjOrString?.encoded

  if (typeof encodedObjOrString === 'object') {
    if (encodedObjOrString.error) return { protocolType: null, decoded: encodedObjOrString.error }
    encoded = encodedObjOrString.encoded
  }

  if (!encoded || encoded === '0x') {
    return {
      protocolType: null,
      decoded: '',
      error: 'Encoded content hash is empty',
    }
  }

  if (encoded) {
    try {
      decoded = contentHash.decode(encoded)
      const codec = contentHash.getCodec(encoded)
      if (codec === 'ipfs-ns') {
        protocolType = 'ipfs'
      } else if (codec === 'ipns-ns') {
        protocolType = 'ipns'
      } else if (codec === 'swarm-ns') {
        protocolType = 'bzz'
      } else if (codec === 'onion') {
        protocolType = 'onion'
      } else if (codec === 'onion3') {
        protocolType = 'onion3'
      } else if (codec === 'skynet-ns') {
        protocolType = 'sia'
      } else if (codec === 'arweave-ns') {
        protocolType = 'arweave'
      } else {
        decoded = encoded
      }
    } catch (e: unknown) {
      if (e instanceof Error) error = e.message
      else error = String(e)
    }
  }
  return { protocolType, decoded, error }
}

export const validateContent = (encoded: string) => {
  return (
    contentHash.isHashOfType(encoded, contentHash.Types.ipfs) ||
    contentHash.isHashOfType(encoded, contentHash.Types.swarm)
  )
}

export const isValidContenthash = (encoded: string) => {
  try {
    const codec = contentHash.getCodec(encoded)
    return utils.isHexString(encoded) && supportedCodecs.includes(codec)
  } catch {
    return false
  }
}

export const getProtocolTypeAndContentId = (address?: string) => {
  if (!address) return { protocolType: null, contentId: null }
  const matched = matchProtocol(address)
  if (!matched)
    return {
      protocolType: null,
      content: '',
      error: 'Invalid content hash address',
    }

  const [, protocolType, contentId] = matched

  return {
    protocolType,
    contentId,
  }
}

export const encodeContentId = (protocolType: ContentHashProtocol, contentId: string) => {
  let encoded
  let error
  try {
    if (protocolType === 'ipfs' && contentId?.length >= 4)
      encoded = `0x${contentHash.encode('ipfs-ns', contentId)}`
    else if (protocolType === 'ipns') encoded = `0x${contentHash.encode('ipns-ns', contentId)}`
    else if (protocolType === 'bzz' && contentId.length >= 4)
      encoded = `0x${contentHash.fromSwarm(contentId)}`
    else if (protocolType === 'onion' && contentId.length === 16)
      encoded = `0x${contentHash.encode('onion', contentId)}`
    else if (protocolType === 'onion3' && contentId.length === 56)
      encoded = `0x${contentHash.encode('onion3', contentId)}`
    else if (protocolType === 'sia' && contentId.length === 46)
      encoded = `0x${contentHash.encode('skynet-ns', contentId)}`
    else if (protocolType === 'arweave' && contentId.length === 43)
      encoded = `0x${contentHash.encode('arweave-ns', contentId)}`
    else error = 'Invalid content id'
  } catch (e: unknown) {
    if (e instanceof Error) error = e.message
    else error = String(e)
  }
  return {
    encoded,
    error,
  }
}

export const encodeContenthash = (address: string) => {
  if (!address)
    return {
      encoded: '',
      error: 'Content hash is empty',
    }

  const matched = matchProtocol(address)
  if (!matched)
    return {
      encoded: '',
      error: 'Content hash is invalid',
    }

  const [, protocol, contentId] = matched

  return encodeContentId(protocol as ContentHashProtocol, contentId)
}
