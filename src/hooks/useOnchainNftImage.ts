import { useMemo } from 'react'
import { Address, labelhash, parseAbi } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

import { getSnrcAddresses } from '@app/constants/chains'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const tokenUriAbi = parseAbi(['function tokenURI(uint256) view returns (string)'])

const decodeBase64Json = (base64: string): { image?: string } | undefined => {
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return undefined
  }
}

/**
 * Returns a registered 2LD's on-chain NFT image, exactly as a wallet (eg
 * MetaMask) renders it. This walks the real wallet path:
 * `BaseRegistrarImplementation.tokenURI(tokenId)` delegates to the
 * `MetadataRenderer`, whose JSON `image` field is a `data:image/svg+xml;base64`
 * URI — which we hand straight to an `<img>`. The token must already exist
 * on-chain (true on the post-registration Complete screen).
 */
export const useOnchainNftImage = (name?: string) => {
  const chainId = useChainId()
  const baseRegistrar = getSnrcAddresses(chainId).BaseRegistrarImplementation as Address | undefined

  const label = name?.split('.')[0]
  const tokenId = label ? BigInt(labelhash(label)) : undefined
  const enabled = !!baseRegistrar && baseRegistrar !== ZERO_ADDRESS && tokenId !== undefined

  const { data: tokenUri, isLoading } = useReadContract({
    address: enabled ? baseRegistrar : undefined,
    abi: tokenUriAbi,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled },
  })

  const image = useMemo(() => {
    const prefix = 'data:application/json;base64,'
    if (!tokenUri || !tokenUri.startsWith(prefix)) return undefined
    const json = decodeBase64Json(tokenUri.slice(prefix.length))
    return typeof json?.image === 'string' ? json.image : undefined
  }, [tokenUri])

  return { image, isLoading }
}
