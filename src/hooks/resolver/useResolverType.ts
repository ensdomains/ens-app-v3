import { useMemo } from 'react'

import { getKnownResolverData } from '@app/constants/resolverAddressData'
import { useChainId } from '@app/hooks/chain/useChainId'
import { useRegistryResolver } from '@app/hooks/resolver/useRegistryResolver'
import { emptyAddress } from '@app/utils/constants'

import { useBasicName } from '../useBasicName'
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

  const basicName = useBasicName({
    name,
    enabled,
  })
  const { isWrapped } = basicName

  const profile = useProfile({
    name,
    enabled,
  })
  const resolverAddress = profile.data?.resolverAddress ?? ''

  const registryResolver = useRegistryResolver({
    name,
    enabled,
  })

  const isLoading = basicName.isLoading || profile.isLoading || registryResolver.isLoading
  const { isFetching } = registryResolver
  const { isError } = registryResolver

  const isWildcard = isWildcardCalc({ registryResolver, resolverAddress, profile })

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
    return
  }, [resolverAddress, isWrapped, enabled, chainId, isLoading, isWildcard])

  return { data, isLoading, isFetching, isError }
}
