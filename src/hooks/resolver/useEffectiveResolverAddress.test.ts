import { expectEnabledHook, mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEffectiveResolverAddress } from './useEffectiveResolverAddress'
import { useUnderlyingResolver } from './useUnderlyingResolver'

vi.mock('@app/hooks/resolver/useUnderlyingResolver')

const mockUseUnderlyingResolver = mockFunction(useUnderlyingResolver)

const registryResolver = '0x1111111111111111111111111111111111111111'
const underlyingResolver = '0x2222222222222222222222222222222222222222'

beforeEach(() => {
  vi.clearAllMocks()
  mockUseUnderlyingResolver.mockReturnValue({ data: null, isLoading: false, isFetching: false })
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

  it('should fall back to the registry resolver when the probe fails', () => {
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
    })
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
})
