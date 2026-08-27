import type { Address } from 'viem'

import { useUnderlyingResolver } from './useUnderlyingResolver'

type UseEffectiveResolverAddressParameters = {
  name: string
  /** The name's resolver as the registry or the subgraph reports it. */
  resolverAddress: Address | undefined

  enabled?: boolean
}

/**
 * The resolver address every resolver judgement should be made against.
 *
 * For the overwhelmingly common v1 name that is just the registry resolver.
 * Where the registry resolver is an ENSv2 abstraction contract it is the
 * resolver behind it: the contract that actually holds the name's records,
 * answers `supportsInterface`, and decides who may write. Judging a name by the
 * abstraction contract instead is what makes a perfectly good resolver look
 * custom, invalid, and not name-wrapper aware.
 *
 * Only one hop is taken — the underlying resolver is never probed for a further
 * abstraction layer.
 */
export const useEffectiveResolverAddress = ({
  name,
  resolverAddress,
  enabled: enabled_ = true,
}: UseEffectiveResolverAddressParameters) => {
  const enabled = enabled_ && !!name

  const underlyingResolver = useUnderlyingResolver({ name, resolverAddress, enabled })

  const { isLoading, isFetching, isCachedData } = underlyingResolver
  const underlyingResolverAddress = underlyingResolver.data ?? undefined

  return {
    // Judging a name against the abstraction contract is the bug this hook
    // exists to prevent, so there is no address to report until the probe has
    // answered one way or the other.
    data: isLoading ? undefined : underlyingResolverAddress ?? resolverAddress,
    isAbstracted: !!underlyingResolverAddress,
    isLoading,
    isFetching,
    isCachedData,
  }
}
