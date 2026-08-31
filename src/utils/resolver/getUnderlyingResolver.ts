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
 * Under ENSv2 the resolver reported for a v1 name can be a *composite*
 * resolver — a read-only mirror (`ENSV1Resolver`, extending
 * `AbstractMirrorResolver`) that resolves the name through another registry
 * instead of holding records itself. It holds no records and implements no
 * record-writing interface; `getResolver` answers with the resolver actually
 * behind it, which is the one records are read from and written to.
 *
 * Composite resolvers are identified by ERC-165, not by guessing: they
 * advertise `ICompositeResolver` (`ens-contracts`,
 * `contracts/resolvers/profiles/ICompositeResolver.sol`). An ordinary resolver
 * does not, which is the answer for ~every name today.
 */
export const COMPOSITE_RESOLVER_INTERFACE_ID = '0xeea330f9'

export const compositeResolverGetResolverSnippet = parseAbi([
  'function getResolver(bytes name) view returns (address resolver, bool offchain)',
])

const erc165SupportsInterfaceSnippet = parseAbi([
  'function supportsInterface(bytes4 interfaceID) view returns (bool)',
])

const ADDRESS_WORD_PADDING = `0x${'00'.repeat(12)}`
const BOOL_WORD_PADDING = `0x${'00'.repeat(31)}`
/** ABI-encoded `true`: the only `supportsInterface` answer that means "composite". */
const TRUE_WORD = `${BOOL_WORD_PADDING}01` as Hex

const isPaddedAddressWord = (word: Hex) => slice(word, 0, 12) === ADDRESS_WORD_PADDING
const isBoolWord = (word: Hex) =>
  slice(word, 0, 31) === BOOL_WORD_PADDING &&
  (slice(word, 31, 32) === '0x00' || slice(word, 31, 32) === '0x01')

/**
 * Reads the underlying resolver out of raw `getResolver` returndata, or `null`
 * for "this is not a usable composite answer".
 *
 * The returndata is shape-checked rather than trusted: a contract that
 * advertises the interface but answers with something else must not be able to
 * feed a garbage address into resolver judgement or into a record write.
 */
export const decodeUnderlyingResolver = ({
  data,
  compositeAddress,
}: {
  data: Hex | undefined
  compositeAddress: Address
}): Address | null => {
  // An address with no code, or a `getResolver` that returns nothing.
  if (!data) return null
  // `ICompositeResolver.getResolver` returns exactly `(address resolver, bool offchain)`.
  if (size(data) !== 64) return null
  const resolverWord = slice(data, 0, 32)
  if (!isPaddedAddressWord(resolverWord)) return null
  if (!isBoolWord(slice(data, 32, 64))) return null
  const resolver = getAddress(slice(resolverWord, 12, 32))
  // A zero or self-referential answer means "nothing behind this" — never a
  // resolver to judge, probe further, or write to.
  if (isAddressEqual(resolver, emptyAddress)) return null
  if (isAddressEqual(resolver, compositeAddress)) return null
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
  /** The name's resolver as the registry, the subgraph, or the UR reports it. */
  resolverAddress: Address
}

/**
 * Resolves a composite (mirror) resolver to the resolver behind it, or `null`
 * when the given resolver is not composite. One hop only — the underlying
 * resolver is never resolved for a further layer.
 *
 * A revert is the expected answer for every ordinary resolver and maps to
 * `null`. Anything else (a genuine transport/RPC failure) is rethrown: a read
 * caller degrades to "not composite" for that fetch without caching the
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
  // Disable viem's CCIP-Read handling for these reads.
  const probeClient = { ...client, ccipRead: false as const }

  const readOrNull = async (data: Hex) =>
    call(probeClient, { to: resolverAddress, data }).catch((error: unknown) => {
      // Reverting is the normal answer for an ordinary resolver, so it is a
      // result and not a failure. Anything else is a genuine RPC problem and
      // is left for the caller to handle.
      if (isRevert(error)) return { data: undefined }
      throw error
    })

  // ERC-165 first: a composite resolver declares itself. This is the same
  // detection ENSjs uses, and it avoids calling `getResolver` speculatively on
  // every resolver in the app.
  const supportsResult = await readOrNull(
    encodeFunctionData({
      abi: erc165SupportsInterfaceSnippet,
      functionName: 'supportsInterface',
      args: [COMPOSITE_RESOLVER_INTERFACE_ID],
    }),
  )
  if (supportsResult.data !== TRUE_WORD) return null

  const result = await readOrNull(
    encodeFunctionData({
      abi: compositeResolverGetResolverSnippet,
      functionName: 'getResolver',
      args: [dnsEncodeName(name)],
    }),
  )

  const underlyingResolver = decodeUnderlyingResolver({
    data: result.data,
    compositeAddress: resolverAddress,
  })
  if (!underlyingResolver) return null

  // A resolver must be a contract. A well-shaped answer pointing at a
  // codeless address would make every record write to it succeed as a silent
  // no-op, so it is not an answer worth honouring.
  const underlyingResolverCode = await getCode(client, { address: underlyingResolver })
  if (!underlyingResolverCode || underlyingResolverCode === '0x') return null

  return underlyingResolver
}
