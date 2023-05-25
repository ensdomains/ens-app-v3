import { useMemo } from 'react'

import { useRegistryResolver } from '@app/hooks/resolver/useRegistryResolver'
import { useChainId } from '@app/hooks/useChainId'
import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { useBasicName } from '../useBasicName'
import { useProfile } from '../useProfile'

type Options = {
  enabled?: boolean
  resolverAddress?: string
  isWrapped?: boolean
}

export const useResolverType = (name: string, options: Options = {}) => {
  const enabled = (options.enabled ?? true) && !!name

  const chainId = useChainId()

  const { isWrapped: internalIsWrapped, isLoading: isBasicNameLoading } = useBasicName(name, {
    skipGraph: false,
    enabled: enabled && typeof options.isWrapped === 'undefined',
  })
  const isWrapped = options.isWrapped ?? internalIsWrapped

  const { profile: internalProfile, loading: isProfileLoading } = useProfile(name, {
    skip: !enabled || !!options.resolverAddress,
  })
  const resolverAddress = options.resolverAddress ?? internalProfile?.resolverAddress ?? ''

  const {
    data: registryResolverAddress,
    isLoading: isRegistryResolverLoading,
    isFetching: isRegistyResolverFetching,
    isError: isRegistryResolverError,
  } = useRegistryResolver(name, {
    enabled,
  })

  const isLoading = isBasicNameLoading || isProfileLoading || isRegistryResolverLoading
  const isFetching = isRegistyResolverFetching
  const isError = isRegistryResolverError

  const isWildcard =
    !isRegistryResolverError &&
    (!registryResolverAddress || registryResolverAddress === emptyAddress) &&
    resolverAddress !== registryResolverAddress

  const data = useMemo(() => {
    if (!enabled || isLoading) return
    const resolverAddressIndex = RESOLVER_ADDRESSES[`${chainId}`]?.indexOf(resolverAddress)
    if (resolverAddressIndex === -1) {
      return { type: 'custom', isWildcard, tone: 'greySecondary' } as const
    }
    if (resolverAddressIndex === 0 || (!isWrapped && resolverAddressIndex === 1)) {
      return { type: 'latest', isWildcard, tone: 'greenSecondary' } as const
    }
    return { type: 'outdated', isWildcard, tone: 'redSecondary' } as const
  }, [resolverAddress, isWrapped, enabled, chainId, isLoading, isWildcard])

  return { data, isLoading, isFetching, isError }
}
