import { expectEnabledHook, mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useChainId } from 'wagmi'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'

import { useEffectiveResolverAddress } from './useEffectiveResolverAddress'
import { useUnderlyingResolver } from './useUnderlyingResolver'

vi.mock('@app/hooks/resolver/useUnderlyingResolver')
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useChainId: vi.fn(),
}))

const mockUseUnderlyingResolver = mockFunction(useUnderlyingResolver)
const mockUseChainId = mockFunction(useChainId)

const registryResolver = '0x1111111111111111111111111111111111111111'
/** A resolver in KNOWN_RESOLVER_DATA for chain 1 — one of ours, never a mirror. */
const knownResolver = KNOWN_RESOLVER_DATA['1']![0].address
const underlyingResolver = '0x2222222222222222222222222222222222222222'

beforeEach(() => {
  vi.clearAllMocks()
  mockUseChainId.mockReturnValue(1)
  mockUseUnderlyingResolver.mockReturnValue({
    data: null,
    isLoading: false,
    isFetching: false,
    isError: false,
  })
})

describe('useEffectiveResolverAddress', () => {
  it('should return the registry resolver when there is no abstraction layer', () => {
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expect(result.current).toMatchObject({
      data: registryResolver,
      isAbstracted: false,
      isLoading: false,
    })
  })

  it('should return the underlying resolver when the registry resolver is an abstraction', () => {
    mockUseUnderlyingResolver.mockReturnValue({
      data: underlyingResolver,
      isLoading: false,
      isFetching: false,
    })
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expect(result.current).toMatchObject({
      data: underlyingResolver,
      isAbstracted: true,
      isLoading: false,
    })
  })

  it('should not report an address while the probe is still in flight', () => {
    mockUseUnderlyingResolver.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    })
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expect(result.current).toMatchObject({
      data: undefined,
      isAbstracted: false,
      isLoading: true,
      isFetching: true,
    })
  })

  it('should fall back to the registry resolver when the lookup fails, and say so', () => {
    mockUseUnderlyingResolver.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
    })
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expect(result.current).toMatchObject({
      data: registryResolver,
      isAbstracted: false,
      isLoading: false,
      // The fallback is NOT an answer: a caller must be able to tell it apart
      // from a genuine "this resolver is not composite", or an abstracted name
      // silently reverts to the migrate-your-resolver prompt this hook exists
      // to prevent.
      isError: true,
    })
  })

  it('should not report an error for a resolver that is simply not composite', () => {
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expect(result.current).toMatchObject({ data: registryResolver, isError: false })
  })

  it('should not look up a resolver that is already a known one', () => {
    // Known resolvers are ours and are never composite mirrors. This hook's
    // loading state reaches useResolverStatus and useAbilities, so looking one
    // up would put an RPC round trip in front of the wrap button, the profile
    // actions and the Edit Profile dialog for every ordinary name.
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: knownResolver }),
    )
    expectEnabledHook(mockUseUnderlyingResolver, false)
    expect(result.current).toMatchObject({ data: knownResolver, isLoading: false })
  })

  it('should still look up a resolver that is not a known one', () => {
    renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expectEnabledHook(mockUseUnderlyingResolver, true)
  })

  it('should not probe when there is no name', () => {
    renderHook(() => useEffectiveResolverAddress({ name: '', resolverAddress: registryResolver }))
    expectEnabledHook(mockUseUnderlyingResolver, false)
  })

  it('should not probe when disabled', () => {
    renderHook(() =>
      useEffectiveResolverAddress({
        name: 'test.eth',
        resolverAddress: registryResolver,
        enabled: false,
      }),
    )
    expectEnabledHook(mockUseUnderlyingResolver, false)
  })

  it('should not probe on the local development chain, and judge by the registry resolver', () => {
    mockUseChainId.mockReturnValue(1337)
    const { result } = renderHook(() =>
      useEffectiveResolverAddress({ name: 'test.eth', resolverAddress: registryResolver }),
    )
    expectEnabledHook(mockUseUnderlyingResolver, false)
    expect(result.current).toMatchObject({
      data: registryResolver,
      isAbstracted: false,
      isLoading: false,
    })
  })
})
