import { DecodedContentHash } from '@ensdomains/ensjs/utils'

export type ContentHashProtocol =
  | 'ipfs'
  | 'ipns'
  | 'bzz'
  | 'onion'
  | 'onion3'
  | 'sia'
  | 'arweave'
  | 'ar'

export type ContentHashProvider = 'ipfs' | 'swarm' | 'onion' | 'skynet' | 'arweave'

type GetContentHashLinkParameters = {
  name: string
  chainId: number
  decodedContentHash: DecodedContentHash
}

export const getContentHashLink = ({
  name,
  chainId,
  decodedContentHash,
}: GetContentHashLinkParameters) => {
  const protocol = decodedContentHash.protocolType
  const hash = decodedContentHash.decoded

  const useEthLink =
    name.endsWith('.eth') && chainId === 1 && (protocol === 'ipfs' || protocol === 'ipns')
  if (useEthLink) {
    return `https://${name}.limo`
  }

  if (protocol === 'ipfs') {
    return `https://${hash}.ipfs.cf-ipfs.com` // using ipfs's secured origin gateway
  }
  if (protocol === 'ipns') {
    return `https://ipfs.euc.li/ipns/${hash}`
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
  if (protocol === 'ar') {
    return `https://arweave.net/${hash}`
  }
  return null
}

export const contentHashToString = (
  decodedContentHash: DecodedContentHash | string | null | undefined,
): string => {
  if (typeof decodedContentHash === 'string') return decodedContentHash
  if (
    decodedContentHash &&
    typeof decodedContentHash === 'object' &&
    decodedContentHash?.decoded &&
    decodedContentHash?.protocolType
  )
    return `${decodedContentHash.protocolType}://${decodedContentHash.decoded}`
  return ''
}

const contentHashProtocolToProviderMap = {
  ipfs: 'ipfs',
  ipns: 'ipfs',
  bzz: 'swarm',
  onion: 'onion',
  onion3: 'onion',
  sia: 'skynet',
  arweave: 'arweave',
  ar: 'arweave',
} as const

export const getContentHashProvider = (protocol: ContentHashProtocol): ContentHashProvider =>
  contentHashProtocolToProviderMap[protocol]
