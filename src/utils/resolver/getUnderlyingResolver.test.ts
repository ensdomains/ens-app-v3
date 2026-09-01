import {
  ContractFunctionRevertedError,
  ExecutionRevertedError,
  getAddress,
  RawContractError,
  type Address,
  type Hex,
} from 'viem'
import { call, getCode } from 'viem/actions'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import type { ClientWithEns } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

import {
  compositeResolverGetResolverSnippet,
  decodeUnderlyingResolver,
  getUnderlyingResolver,
} from './getUnderlyingResolver'

vi.mock('viem/actions', () => ({ call: vi.fn(), getCode: vi.fn() }))

const compositeAddress = '0x1111111111111111111111111111111111111111'
const underlyingAddress = '0x2222222222222222222222222222222222222222'

const toWord = (value: string) => value.replace(/^0x/, '').padStart(64, '0')
const returndata = (...words: string[]) => `0x${words.map(toWord).join('')}` as Hex
const FALSE_WORD = returndata('0')
const TRUE_WORD = returndata('1')
/** `getResolver` answering `(underlying, offchain=false)`. */
const compositeAnswer = returndata(underlyingAddress, '0')

describe('decodeUnderlyingResolver', () => {
  it('returns the underlying resolver for a well-formed answer', () => {
    expect(decodeUnderlyingResolver({ data: compositeAnswer, compositeAddress })).toEqual(
      getAddress(underlyingAddress),
    )
  })

  it('rejects an offchain=true answer', () => {
    // The address alone does not locate an offchain resolver, so it is not
    // something to judge a name by, display, or write records to.
    expect(
      decodeUnderlyingResolver({ data: returndata(underlyingAddress, '1'), compositeAddress }),
    ).toBeNull()
  })

  it('returns null when the resolver does not answer at all', () => {
    expect(decodeUnderlyingResolver({ data: undefined, compositeAddress })).toBeNull()
    expect(decodeUnderlyingResolver({ data: '0x', compositeAddress })).toBeNull()
  })

  it('returns null for a zero underlying resolver', () => {
    expect(
      decodeUnderlyingResolver({ data: returndata(emptyAddress, '0'), compositeAddress }),
    ).toBeNull()
  })

  it('returns null for a self-referential underlying resolver', () => {
    expect(
      decodeUnderlyingResolver({ data: returndata(compositeAddress, '0'), compositeAddress }),
    ).toBeNull()
  })

  it('returns null when the answer is not two words', () => {
    expect(
      decodeUnderlyingResolver({ data: returndata(underlyingAddress), compositeAddress }),
    ).toBeNull()
    expect(
      decodeUnderlyingResolver({
        data: returndata(underlyingAddress, '0', underlyingAddress),
        compositeAddress,
      }),
    ).toBeNull()
  })

  it('returns null when the resolver word is not a left-padded address', () => {
    const dirtyResolverWord = `ff${toWord(underlyingAddress).slice(2)}`
    expect(
      decodeUnderlyingResolver({
        data: `0x${dirtyResolverWord}${toWord('0')}` as Hex,
        compositeAddress,
      }),
    ).toBeNull()
  })

  it('returns null when the second word is not a boolean', () => {
    // An address-shaped second word is what the pre-ENSv2 assumption expected;
    // `ICompositeResolver` returns `(address, bool)`, so this is not an answer
    // from the interface we asked for.
    expect(
      decodeUnderlyingResolver({
        data: returndata(underlyingAddress, underlyingAddress),
        compositeAddress,
      }),
    ).toBeNull()
    expect(
      decodeUnderlyingResolver({ data: returndata(underlyingAddress, '2'), compositeAddress }),
    ).toBeNull()
  })
})

describe('getUnderlyingResolver', () => {
  const client = {} as ClientWithEns
  const mockCall = call as unknown as Mock
  const mockGetCode = getCode as unknown as Mock

  const mockComposite = (answer: Hex = compositeAnswer) => {
    mockCall.mockResolvedValueOnce({ data: TRUE_WORD }).mockResolvedValueOnce({ data: answer })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCode.mockResolvedValue('0x6080')
  })

  it('returns the underlying resolver of a composite resolver', async () => {
    mockComposite()

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: compositeAddress as Address,
      }),
    ).resolves.toEqual(getAddress(underlyingAddress))
    // ERC-165 first, then `getResolver`.
    expect(mockCall).toHaveBeenCalledTimes(2)
    // Neither read may follow an OffchainLookup revert to a contract-supplied URL.
    expect(mockCall).toHaveBeenCalledWith(
      expect.objectContaining({ ccipRead: false }),
      expect.anything(),
    )
    expect(mockGetCode).toHaveBeenCalledWith(client, { address: getAddress(underlyingAddress) })
  })

  it('does not call getResolver on a resolver that is not composite', async () => {
    mockCall.mockResolvedValueOnce({ data: FALSE_WORD })

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: compositeAddress as Address,
      }),
    ).resolves.toBeNull()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it('treats an ERC-165 answer that is not a bare boolean as "not composite"', async () => {
    mockCall.mockResolvedValueOnce({ data: returndata(underlyingAddress) })

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: compositeAddress as Address,
      }),
    ).resolves.toBeNull()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it.each([undefined, '0x'])(
    'treats an answer pointing at a codeless address as "not composite" (code: %s)',
    async (code) => {
      mockComposite()
      mockGetCode.mockResolvedValueOnce(code)

      await expect(
        getUnderlyingResolver(client, {
          name: 'test.eth',
          resolverAddress: compositeAddress as Address,
        }),
      ).resolves.toBeNull()
    },
  )

  it.each([
    new ContractFunctionRevertedError({
      abi: compositeResolverGetResolverSnippet,
      functionName: 'getResolver',
    }),
    new ExecutionRevertedError(),
    new RawContractError({ data: '0x' }),
  ])(
    'treats a revert from the interface check as "not composite" without retrying: %s',
    async (revertError) => {
      mockCall.mockRejectedValueOnce(revertError)

      await expect(
        getUnderlyingResolver(client, {
          name: 'test.eth',
          resolverAddress: compositeAddress as Address,
        }),
      ).resolves.toBeNull()
      expect(mockCall).toHaveBeenCalledTimes(1)
    },
  )

  it('treats a revert from getResolver as "not composite"', async () => {
    mockCall
      .mockResolvedValueOnce({ data: TRUE_WORD })
      .mockRejectedValueOnce(new ExecutionRevertedError())

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: compositeAddress as Address,
      }),
    ).resolves.toBeNull()
  })

  it('rethrows a non-revert failure so callers can fail closed', async () => {
    const transportError = new Error('network unavailable')
    mockCall.mockRejectedValueOnce(transportError)

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: compositeAddress as Address,
      }),
    ).rejects.toBe(transportError)
  })

  it('does not read an empty name, an invalid address, or the zero address', async () => {
    await expect(
      getUnderlyingResolver(client, { name: '', resolverAddress: compositeAddress as Address }),
    ).resolves.toBeNull()
    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: 'not-an-address' as Address,
      }),
    ).resolves.toBeNull()
    await expect(
      getUnderlyingResolver(client, { name: 'test.eth', resolverAddress: emptyAddress }),
    ).resolves.toBeNull()
    expect(mockCall).not.toHaveBeenCalled()
  })
})
