import { useEffect, useState } from 'react'

import { getProtocolType } from '@ensdomains/ensjs/utils'

const SUPPORTED_PROTOCOL_REGEX = /^(http|https|ar|ipfs|eip155):/

const chainIdToNetwork = (chainId?: string) => {
  if (chainId === '1') return 'mainnet'
  if (chainId === '5') return 'goerli'
  if (chainId === '11155111') return 'sepolia'
  return ''
}

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'no-key'
const makeApiURL = (address: string) => {
  const match = address.match(/^eip155:(\d+)\/(erc1155|erc721):(.*)\/(.*)$/)
  const chainId = match?.[1]
  const tokenType = match?.[2]
  const contractAddress = match?.[3]
  const tokenId = match?.[4]
  const network = chainIdToNetwork(chainId)
  if (tokenType && contractAddress && tokenId)
    return `https://eth-${network}.alchemyapi.io/nft/v2/${alchemyKey}/getNFTMetadata/?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=${tokenType}&refreshCache=false`
  return undefined
}

const getAvatarSrc = async (record: string) => {
  try {
    const protocol = record.match(SUPPORTED_PROTOCOL_REGEX)?.[1]
    if (!protocol) return

    if (protocol === 'ipfs') {
      const { decoded } = getProtocolType(record)!
      return `https://cloudflare-ipfs.com/ipfs/${decoded}`
    }

    if (protocol === 'ar') {
      const { decoded } = getProtocolType(record)!
      return `https://arweave.net/${decoded}`
    }

    if (protocol === 'eip155') {
      const apiUrl = makeApiURL(record)
      if (!apiUrl) return
      const resp = await fetch(apiUrl, {
        method: 'GET',
        redirect: 'follow',
      }).then((res) => res.json())
      return (resp as any)?.media?.[0]?.gateway
    }

    return record
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const useAvatarFromRecord = (avatarRecord?: string) => {
  const [avatar, setAvatar] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    if (avatarRecord)
      getAvatarSrc(avatarRecord)
        .then((_avatar) => {
          if (mounted) setAvatar(_avatar)
        })
        .finally(() => {
          if (mounted) setIsLoading(false)
        })
    return () => {
      mounted = false
    }
  }, [avatarRecord])

  return {
    avatar,
    isLoading,
  }
}
