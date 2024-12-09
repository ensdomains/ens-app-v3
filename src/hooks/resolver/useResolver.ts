import { Hash } from 'viem'
import { useChainId } from 'wagmi'

import { KNOWN_RESOLVER_DATA, KnownResolverItem } from '@app/constants/resolverAddressData'

import { useResolverHasInterfaces } from '../useResolverHasInterfaces'

type Resolver = KnownResolverItem

export const useResolver = ({ resolverAddress }: { resolverAddress?: Hash }) => {
  const chainId = useChainId()
  const knownResolver = KNOWN_RESOLVER_DATA[chainId]?.find((r) => r.address === resolverAddress)

  const interfaces = useResolverHasInterfaces({
    resolverAddress: resolverAddress!,
    interfaceNames: [
      'AbiResolver',
      'AddressResolver',
      'MultiCoinAddressResolver',
      'ContentHashResolver',
      'TextResolver',
    ],
    enabled: !knownResolver && !!resolverAddress,
  })

  if (knownResolver) return knownResolver
  return {}
}
