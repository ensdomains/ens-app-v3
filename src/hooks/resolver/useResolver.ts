import { Hash } from 'viem'
import { useChainId } from 'wagmi'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'

export const useResolver = ({ resolverAddress }: { resolverAddress?: Hash }) => {
  const chainId = useChainId()
  const knownResolver = KNOWN_RESOLVER_DATA[chainId]?.find((r) => r.address === resolverAddress)

  if (knownResolver) return knownResolver
  return {}
}
