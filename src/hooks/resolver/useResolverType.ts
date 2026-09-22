import { useMemo } from 'react'
import { useChainId } from 'wagmi'

import { getKnownResolverData } from '@app/constants/resolverAddressData'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'
import { useRegistryResolver } from '@app/hooks/resolver/useRegistryResolver'
import { emptyAddress } from '@app/utils/constants'

import { useIsWrapped } from '../useIsWrapped'
import { useProfile } from '../useProfile'

type UseResolverTypeParameters = {
  name: string

  enabled?: boolean
}

export const isWildcardCalc = ({
  registryResolver,
  resolverAddress,
  profile,
}: {
  registryResolver: ReturnType<typeof useRegistryResolver>
  resolverAddress: string
  profile: ReturnType<typeof useProfile>
}) =>
  !registryResolver.isError &&
  (!registryResolver.data || registryResolver.data === emptyAddress) &&
  resolverAddress !== registryResolver.data &&
  !profile.isFetching

export const useResolverType = ({ name, enabled: enabled_ = true }: UseResolverTypeParameters) => {
  const enabled = enabled_ && !!name

  const chainId = useChainId()

  const isWrappedQuery = useIsWrapped({
    name,
    enabled,
  })
  const { data: isWrapped } = isWrappedQuery

  const profile = useProfile({
    name,
    enabled,
  })
  const registryResolverAddress = profile.data?.resolverAddress

  const effectiveResolver = useEffectiveResolverAddress({
    name,
    resolverAddress: registryResolverAddress,
    enabled,
  })
  const resolverAddress = effectiveResolver.data ?? ''

  const registryResolver = useRegistryResolver({
    name,
    enabled,
  })

  const isLoading =
    isWrappedQuery.isLoading ||
    profile.isLoading ||
    registryResolver.isLoading ||
    effectiveResolver.isLoading
  const isFetching = registryResolver.isFetching || effectiveResolver.isFetching
  const { isError } = registryResolver

  // Wildcard resolution is a registry-level fact: the registry has no resolver
  // for this name but the profile resolved one anyway, from an ancestor. Both
  // sides of that comparison stay the registry-reported addresses.
  const isWildcard = isWildcardCalc({
    registryResolver,
    resolverAddress: registryResolverAddress ?? '',
    profile,
  })

  const data = useMemo(() => {
    if (!enabled || isLoading) return
    const knownResolverData = getKnownResolverData({ chainId, resolverAddress })
    if (!knownResolverData) {
      return { type: 'custom', isWildcard, tone: 'greySecondary' } as const
    }
    if (
      (isWrapped && !knownResolverData.isNameWrapperAware) ||
      knownResolverData.tag === 'outdated'
    )
      return { type: 'outdated', isWildcard, tone: 'redSecondary' } as const
    if (knownResolverData.tag === 'latest')
      return { type: 'latest', isWildcard, tone: 'greenSecondary' } as const
  }, [resolverAddress, isWrapped, enabled, chainId, isLoading, isWildcard])

  return { data, isLoading, isFetching, isError }
}
