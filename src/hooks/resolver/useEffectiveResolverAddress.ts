import type { Address } from 'viem'
import { useChainId } from 'wagmi'

import {
  getKnownResolverData,
  isOfficialCompositeResolver,
} from '@app/constants/resolverAddressData'

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
  const chainId = useChainId()

  // Known public resolvers are never composite mirrors, and unknown contracts
  // must not be trusted as mirrors based on an ERC-165 self-report. Only an
  // ENS-deployed composite allowlisted for the active chain is probed.
  const reportedIsKnownResolver = !!getKnownResolverData({
    chainId,
    resolverAddress: resolverAddress ?? '',
  })
  const isOfficialComposite = isOfficialCompositeResolver({
    chainId,
    resolverAddress: resolverAddress ?? '',
  })

  const enabled = enabled_ && !!name && !reportedIsKnownResolver && isOfficialComposite

  const underlyingResolver = useUnderlyingResolver({ name, resolverAddress, enabled })

  const { isLoading, isFetching, isCachedData, isError } = underlyingResolver
  const underlyingResolverAddress = isOfficialComposite
    ? underlyingResolver.data ?? undefined
    : undefined

  return {
    // Judging a name against the abstraction contract is the bug this hook
    // exists to prevent, so there is no address to report until the probe has
    // answered one way or the other.
    //
    // A lookup error falls back to the supplied address. The allowlisted
    // composite is then judged unusable until the lookup succeeds, while
    // `isError` lets callers distinguish the fallback from a decoded answer.
    data: isLoading ? undefined : underlyingResolverAddress ?? resolverAddress,
    isAbstracted: !!underlyingResolverAddress,
    /** The lookup failed, so `data` is the unresolved fallback, not an answer. */
    isError,
    isLoading,
    isFetching,
    isCachedData,
  }
}
