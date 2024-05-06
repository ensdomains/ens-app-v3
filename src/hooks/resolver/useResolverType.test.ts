import { mockFunction, PartialMockedFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { emptyAddress } from '@app/utils/constants'

import { useIsWrapped } from '../useIsWrapped'
import { useProfile } from '../useProfile'
import { useRegistryResolver } from './useRegistryResolver'
import { isWildcardCalc, useResolverType } from './useResolverType'

vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/resolver/useRegistryResolver')

const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseProfile = mockFunction(useProfile)
const mockUseRegistryResolver = mockFunction(useRegistryResolver)

const createProfileData = (
  overwrite: ReturnType<PartialMockedFunction<typeof useProfile>> = {},
) => ({
  data: {
    resolverAddress: KNOWN_RESOLVER_DATA['1']![0].address,
  },
  isLoading: false,
  ...overwrite,
})

const createRegistryResolverData = <
  TOverwrite extends ReturnType<PartialMockedFunction<typeof useRegistryResolver>>,
>(
  overwrite: TOverwrite = {} as TOverwrite,
) =>
  ({
    data: KNOWN_RESOLVER_DATA['1']![0].address,
    isLoading: false,
    isSuccess: true,
    ...overwrite,
  }) as const

beforeEach(() => {
  vi.clearAllMocks()
  mockUseIsWrapped.mockReturnValue({ data: true, isLoading: false })
  mockUseProfile.mockReturnValue(createProfileData())
  mockUseRegistryResolver.mockReturnValue(createRegistryResolverData())
})

describe('useResolverType', () => {
  it('should return type is latest for base mock data', () => {
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: { type: 'latest', isWildcard: false, tone: 'greenSecondary' },
      }),
    )
    expect(mockUseIsWrapped).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseRegistryResolver).toHaveBeenCalled()
  })

  it('should return isLoading is false and data is undefined if enabled is false', () => {
    const { result } = renderHook(() => useResolverType({ name: 'test.eth', enabled: false }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
      }),
    )
    expect(mockUseIsWrapped).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
    expect(mockUseProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
    expect(mockUseRegistryResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('should return isLoading is false and data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverType({ name: '' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
      }),
    )
    expect(mockUseIsWrapped).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
    expect(mockUseProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
    expect(mockUseRegistryResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('should return isLoading is true and data is undefined if useBasicName is loading', () => {
    mockUseIsWrapped.mockReturnValueOnce({ data: true, isLoading: true })
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: undefined,
        isLoading: true,
      }),
    )
    expect(mockUseIsWrapped).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
    expect(mockUseProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
    expect(mockUseRegistryResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
  })

  it('should return isLoading is true and data is undefined if useRegistryResolve is loading', () => {
    mockUseRegistryResolver.mockReturnValueOnce(createRegistryResolverData({ isLoading: true }))
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: undefined,
        isLoading: true,
      }),
    )
    expect(mockUseIsWrapped).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
    expect(mockUseProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
    expect(mockUseRegistryResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )
  })

  it('should return type is null if resolver is second latest and is wrapped', () => {
    mockUseProfile.mockReturnValueOnce(
      createProfileData({
        data: {
          resolverAddress: KNOWN_RESOLVER_DATA['1']![1].address,
        },
      }),
    )
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: { type: 'outdated', isWildcard: false, tone: 'redSecondary' },
        isLoading: false,
      }),
    )
  })

  it('should return type is latest if resolver is second latest but name is not wrapped', () => {
    mockUseProfile.mockReturnValueOnce(
      createProfileData({
        data: {
          resolverAddress: KNOWN_RESOLVER_DATA['1']![1].address,
        },
      }),
    )
    mockUseIsWrapped.mockReturnValueOnce({ data: false, isLoading: false })
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
      }),
    )
  })

  it('should return type is custom if resolver is not in resolver list', () => {
    mockUseProfile.mockReturnValueOnce(
      createProfileData({ data: { resolverAddress: '0xresolver' } }),
    )
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: { type: 'custom', isWildcard: false, tone: 'greySecondary' },
        isLoading: false,
      }),
    )
  })

  it('should return isWildcard is true if registry resolver is empty but profile resolver has value', () => {
    mockUseRegistryResolver.mockReturnValueOnce(createRegistryResolverData({ data: emptyAddress }))
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: { type: 'latest', isWildcard: true, tone: 'greenSecondary' },
        isLoading: false,
      }),
    )
  })

  it('should return isWildcard is false if registry resolver is empty but profile resolver is also empty', () => {
    mockUseRegistryResolver.mockReturnValueOnce(createRegistryResolverData({ data: emptyAddress }))
    mockUseProfile.mockReturnValueOnce(
      createProfileData({ data: { resolverAddress: emptyAddress } }),
    )
    const { result } = renderHook(() => useResolverType({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({
        data: { type: 'custom', isWildcard: false, tone: 'greySecondary' },
        isLoading: false,
      }),
    )
  })
})

describe('isWildcardCalc', () => {
  const registryResolver = { isError: false, data: null } as unknown as ReturnType<
    typeof useRegistryResolver
  >
  const resolverAddress = '0x123' as const
  const profile = { isFetching: false } as unknown as ReturnType<typeof useProfile>

  it('returns true when registryResolver is not an error and data is null or empty address and resolverAddress is not equal to data and profile is not fetching', () => {
    registryResolver.isError = false
    registryResolver.data = undefined
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(true)

    registryResolver.data = '0x0000000000000000000000000000000000000000'
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(true)
  })

  it('returns false when registryResolver is an error', () => {
    registryResolver.isError = true
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(false)
  })

  it('returns false when registryResolver data is not null or empty address', () => {
    registryResolver.isError = false
    registryResolver.data = '0x456'
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(false)
  })

  it('returns false when resolverAddress is equal to registryResolver data', () => {
    registryResolver.isError = false
    registryResolver.data = '0x123'
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(false)
  })

  it('returns false when profile is fetching', () => {
    registryResolver.isError = false
    registryResolver.data = undefined
    profile.isFetching = true
    expect(isWildcardCalc({ registryResolver, resolverAddress, profile })).toBe(false)
  })
})
