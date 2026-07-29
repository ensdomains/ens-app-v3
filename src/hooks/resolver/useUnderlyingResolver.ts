import { isAddressEqual, parseAbi, type Address } from 'viem'
import { useReadContract } from 'wagmi'

import { emptyAddress } from '@app/utils/constants'
import { dnsEncodeName } from '@app/utils/reverse'

/**
 * ABI snippet for the ENSv2 `ENSV1Resolver` abstraction contract. Under ENSv2
 * the resolver stored in the registry/subgraph for a v1 name can be a single
 * abstraction/wrapper contract. Calling `getResolver` on it reveals the true
 * underlying resolver of the name.
 *
 * Normal resolvers do not implement `getResolver`, so this call is expected to
 * revert for them. A revert simply means "there is no abstraction layer".
 */
export const ensV1ResolverAbstractionSnippet = parseAbi([
  'function getResolver(bytes name) view returns (address resolver, address offchain)',
])

type UseUnderlyingResolverParameters = {
  name: string
  /** The currently-known resolver, from the registry/subgraph. */
  resolverAddress: string | undefined
}

/**
 * Attempts to resolve the true underlying resolver of a name when its
 * registry/subgraph resolver is the ENSv2 `ENSV1Resolver` abstraction contract.
 *
 * If `resolverAddress` implements `getResolver` and returns a non-zero resolver,
 * `isAbstracted` is `true` and `underlyingResolver` holds the true resolver.
 * Otherwise the call reverts (or returns zero) and `isAbstracted` is `false`,
 * meaning callers should keep using the original `resolverAddress`.
 */
export const useUnderlyingResolver = ({
  name,
  resolverAddress,
}: UseUnderlyingResolverParameters) => {
  const query = useReadContract({
    abi: ensV1ResolverAbstractionSnippet,
    address: resolverAddress as Address | undefined,
    functionName: 'getResolver',
    args: [dnsEncodeName(name)],
    query: {
      enabled: !!name && !!resolverAddress && resolverAddress !== emptyAddress,
      // The call reverts for resolvers that do not implement `getResolver`.
      // That is an expected outcome, not a transient failure, so never retry.
      retry: false,
    },
  })

  const underlyingResolver = query.data?.[0]
  const offchainResolver = query.data?.[1]

  const isAbstracted =
    query.isSuccess && !!underlyingResolver && !isAddressEqual(underlyingResolver, emptyAddress)

  return {
    ...query,
    underlyingResolver,
    offchainResolver,
    isAbstracted,
  }
}
