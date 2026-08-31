import type { Address } from 'viem'
import { localhost } from 'viem/chains'
import { useChainId } from 'wagmi'

import { getKnownResolverData } from '@app/constants/resolverAddressData'

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

  // The ENSv2 resolver abstraction does not exist on the local development
  // chain (v1-only), so there is nothing to probe there: skip the extra
  // `getResolver` call entirely and judge names by the registry resolver, as
  // on mainnet before the abstraction ships.
  // A known resolver is one of ours and is never a composite mirror, so there
  // is nothing behind it to look up. Skipping keeps the zero-network path these
  // addresses already had: this hook's loading state reaches useResolverStatus
  // and useAbilities, so looking up would put an RPC round trip in front of the
  // wrap button, the profile actions and the Edit Profile dialog on every
  // ordinary name.
  const reportedIsKnownResolver = !!getKnownResolverData({
    chainId,
    resolverAddress: resolverAddress ?? '',
  })

  const enabled = enabled_ && !!name && chainId !== localhost.id && !reportedIsKnownResolver

  const underlyingResolver = useUnderlyingResolver({ name, resolverAddress, enabled })

  const { isLoading, isFetching, isCachedData, isError } = underlyingResolver
  const underlyingResolverAddress = underlyingResolver.data ?? undefined

  return {
    // Judging a name against the abstraction contract is the bug this hook
    // exists to prevent, so there is no address to report until the probe has
    // answered one way or the other.
    //
    // A lookup ERROR (a transport failure — a non-composite resolver answers
    // the ERC-165 check cleanly rather than erroring) falls back to the
    // supplied address rather than reporting nothing: for the overwhelmingly
    // common non-composite name that address is the correct answer, and
    // erroring the composed hooks instead would take every ordinary name down
    // with one flaky RPC round trip. A refetch error never replaces
    // previously fetched data.
    //
    // A write flow CAN pin this fallback, but never a wrong one that reaches
    // the chain: every write is gated behind the authorisation judgement,
    // which fails closed on a composite mirror because the mirror supports no
    // record interfaces. The cost of the fallback is therefore availability,
    // not safety — an abstracted name is judged unusable until the lookup
    // succeeds, and lands on the migrate-your-resolver prompt meanwhile.
    // `isError` distinguishes that from a genuine "not composite" answer. No
    // caller threads it into a retry surface yet; doing so is what would turn
    // this from a silent degradation into a recoverable one.
    data: isLoading ? undefined : underlyingResolverAddress ?? resolverAddress,
    isAbstracted: !!underlyingResolverAddress,
    /** The lookup failed, so `data` is the unresolved fallback, not an answer. */
    isError,
    isLoading,
    isFetching,
    isCachedData,
  }
}
