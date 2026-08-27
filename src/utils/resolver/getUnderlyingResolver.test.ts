import {
  ContractFunctionRevertedError,
  ExecutionRevertedError,
  getAddress,
  RawContractError,
  type Address,
  type Hex,
} from 'viem'
import { call } from 'viem/actions'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import type { ClientWithEns } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

import {
  decodeUnderlyingResolver,
  ensV1ResolverGetResolverSnippet,
  getUnderlyingResolver,
} from './getUnderlyingResolver'

vi.mock('viem/actions', () => ({ call: vi.fn() }))

const abstractionAddress = '0x1111111111111111111111111111111111111111'
const underlyingAddress = '0x2222222222222222222222222222222222222222'

const toWord = (value: string) => value.replace(/^0x/, '').padStart(64, '0')
const returndata = (...words: string[]) => `0x${words.map(toWord).join('')}` as Hex

describe('decodeUnderlyingResolver', () => {
  it('returns the underlying resolver for a well-formed answer', () => {
    expect(
      decodeUnderlyingResolver({
        data: returndata(underlyingAddress, emptyAddress),
        abstractionAddress,
      }),
    ).toEqual(getAddress(underlyingAddress))
  })

  it('returns null when the resolver does not answer at all', () => {
    expect(decodeUnderlyingResolver({ data: undefined, abstractionAddress })).toBeNull()
    expect(decodeUnderlyingResolver({ data: '0x', abstractionAddress })).toBeNull()
  })

  it('returns null for a zero underlying resolver', () => {
    expect(
      decodeUnderlyingResolver({
        data: returndata(emptyAddress, emptyAddress),
        abstractionAddress,
      }),
    ).toBeNull()
  })

  it('returns null for a self-referential underlying resolver', () => {
    expect(
      decodeUnderlyingResolver({
        data: returndata(abstractionAddress, emptyAddress),
        abstractionAddress,
      }),
    ).toBeNull()
  })

  it('returns null when the answer is not two words', () => {
    expect(
      decodeUnderlyingResolver({ data: returndata(underlyingAddress), abstractionAddress }),
    ).toBeNull()
    expect(
      decodeUnderlyingResolver({
        data: returndata(underlyingAddress, emptyAddress, underlyingAddress),
        abstractionAddress,
      }),
    ).toBeNull()
  })

  it('returns null when a word is not a left-padded address', () => {
    const dirtyResolverWord = `ff${toWord(underlyingAddress).slice(2)}`
    expect(
      decodeUnderlyingResolver({
        data: `0x${dirtyResolverWord}${toWord(emptyAddress)}` as Hex,
        abstractionAddress,
      }),
    ).toBeNull()

    const dirtyOffchainWord = `ff${toWord(emptyAddress).slice(2)}`
    expect(
      decodeUnderlyingResolver({
        data: `0x${toWord(underlyingAddress)}${dirtyOffchainWord}` as Hex,
        abstractionAddress,
      }),
    ).toBeNull()
  })
})

describe('getUnderlyingResolver', () => {
  const client = {} as ClientWithEns
  const mockCall = call as unknown as Mock

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the underlying resolver for a well-formed abstraction answer', async () => {
    mockCall.mockResolvedValueOnce({ data: returndata(underlyingAddress, emptyAddress) })

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: abstractionAddress as Address,
      }),
    ).resolves.toEqual(getAddress(underlyingAddress))
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it.each([
    new ContractFunctionRevertedError({
      abi: ensV1ResolverGetResolverSnippet,
      functionName: 'getResolver',
    }),
    new ExecutionRevertedError(),
    new RawContractError({ data: '0x' }),
  ])('treats a revert as "not abstracted" without retrying: %s', async (revertError) => {
    mockCall.mockRejectedValueOnce(revertError)

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: abstractionAddress as Address,
      }),
    ).resolves.toBeNull()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it('rethrows a non-revert failure so callers can fail closed', async () => {
    const transportError = new Error('network unavailable')
    mockCall.mockRejectedValueOnce(transportError)

    await expect(
      getUnderlyingResolver(client, {
        name: 'test.eth',
        resolverAddress: abstractionAddress as Address,
      }),
    ).rejects.toBe(transportError)
  })

  it('does not probe an empty name, an invalid address, or the zero address', async () => {
    await expect(
      getUnderlyingResolver(client, {
        name: '',
        resolverAddress: abstractionAddress as Address,
      }),
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
