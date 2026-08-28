import {
  BaseError,
  ContractFunctionRevertedError,
  encodeFunctionData,
  ExecutionRevertedError,
  getAddress,
  isAddress,
  isAddressEqual,
  parseAbi,
  RawContractError,
  size,
  slice,
  type Address,
  type Hex,
} from 'viem'
import { call, getCode } from 'viem/actions'

import type { ClientWithEns } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { dnsEncodeName } from '@app/utils/reverse'

/**
 * The ENSv2 resolver abstraction layer, described in exactly one place.
 *
 * Under ENSv2 the resolver that the registry (or the subgraph) reports for a v1
 * name can be an `ENSV1Resolver` abstraction contract which mirrors the name's
 * real resolver instead of holding records itself. That contract answers
 * `getResolver` with the resolver actually behind it. An ordinary v1 resolver
 * has no such function and reverts, which is the answer for ~every name today.
 *
 * This signature could not be verified against contracts-v2 from this machine
 * (see `Spec defects` in the WEB-688 run record). If it is wrong, this module
 * is the only thing that needs to change.
 */
export const ensV1ResolverGetResolverSnippet = parseAbi([
  'function getResolver(bytes name) view returns (address resolver, address offchain)',
])

const ADDRESS_WORD_PADDING = `0x${'00'.repeat(12)}`

const isPaddedAddressWord = (word: Hex) => slice(word, 0, 12) === ADDRESS_WORD_PADDING

/**
 * Reads the underlying resolver out of raw `getResolver` returndata, or `null`
 * for "this resolver is not an abstraction contract".
 *
 * The returndata is shape-checked rather than trusted: an unrelated contract
 * that happens to expose a different `getResolver` must not be able to feed a
 * garbage address into resolver judgement or, worse, into a record write.
 */
export const decodeUnderlyingResolver = ({
  data,
  abstractionAddress,
}: {
  data: Hex | undefined
  abstractionAddress: Address
}): Address | null => {
  // An address with no code, or a `getResolver` that returns nothing.
  if (!data) return null
  // The abstraction returns exactly `(address resolver, address offchain)`.
  if (size(data) !== 64) return null
  const resolverWord = slice(data, 0, 32)
  if (!isPaddedAddressWord(resolverWord) || !isPaddedAddressWord(slice(data, 32, 64))) return null
  const resolver = getAddress(slice(resolverWord, 12, 32))
  // A zero or self-referential answer means "no abstraction here" — never a
  // resolver to judge, probe further, or write to.
  if (isAddressEqual(resolver, emptyAddress)) return null
  if (isAddressEqual(resolver, abstractionAddress)) return null
  return resolver
}

const isRevert = (error: unknown) =>
  error instanceof BaseError &&
  !!error.walk(
    (err) =>
      err instanceof ExecutionRevertedError ||
      err instanceof ContractFunctionRevertedError ||
      err instanceof RawContractError,
  )

type GetUnderlyingResolverParameters = {
  name: string
  /** The name's resolver as the registry or the subgraph reports it. */
  resolverAddress: Address
}

/**
 * Probes a resolver for the ENSv2 abstraction layer, returning the resolver
 * behind it or `null` when there is none. One hop only — the underlying
 * resolver is never probed for a further abstraction.
 *
 * A revert is the expected answer for every ordinary v1 resolver and maps to
 * `null`. Anything else (a genuine transport/RPC failure) is rethrown: a read
 * caller degrades to "not abstracted" for that fetch without caching the
 * failure, and a transaction builder fails closed rather than risking record
 * calldata against the wrong contract.
 */
export const getUnderlyingResolver = async (
  client: ClientWithEns,
  { name, resolverAddress }: GetUnderlyingResolverParameters,
): Promise<Address | null> => {
  if (!name) return null
  if (!isAddress(resolverAddress, { strict: false })) return null
  if (isAddressEqual(resolverAddress, emptyAddress)) return null

  // The answer must be an L1 contract (enforced below), so an OffchainLookup
  // revert is meaningless here — and following it would let any contract a
  // name points at direct the viewer's browser to a URL of its choosing.
  // Disable viem's CCIP-Read handling for this one probe.
  const probeClient = { ...client, ccipRead: false as const }
  const result = await call(probeClient, {
    to: resolverAddress,
    data: encodeFunctionData({
      abi: ensV1ResolverGetResolverSnippet,
      functionName: 'getResolver',
      args: [dnsEncodeName(name)],
    }),
  }).catch((error: unknown) => {
    // Reverting is the normal answer for every ordinary v1 resolver, so it is
    // a result and not a failure. Anything else is a genuine RPC problem and
    // is left for the caller to handle.
    if (isRevert(error)) return { data: undefined }
    throw error
  })

  const underlyingResolver = decodeUnderlyingResolver({
    data: result.data,
    abstractionAddress: resolverAddress,
  })
  if (!underlyingResolver) return null

  // A resolver must be a contract. A well-shaped answer pointing at a
  // codeless address would make every record write to it succeed as a silent
  // no-op, so it is not an abstraction answer worth honouring.
  const underlyingResolverCode = await getCode(client, { address: underlyingResolver })
  if (!underlyingResolverCode || underlyingResolverCode === '0x') return null

  return underlyingResolver
}
