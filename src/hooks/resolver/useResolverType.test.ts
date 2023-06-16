import { renderHook } from '@app/test-utils'

import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { useResolverType } from './useResolverType'

jest.mock('@app/hooks/useChainId', () => ({
  useChainId: () => 1,
}))

const makeMocBasicName = (overwrite: object = {}) => ({
  isWrapped: true,
  isLoading: false,
  ...overwrite,
})
const mockUseBasicName = jest.fn().mockReturnValue(makeMocBasicName())
jest.mock('@app/hooks/useBasicName', () => ({
  useBasicName: (_: string, options: any) => {
    if (options.enabled ?? true) return mockUseBasicName()
    return { data: undefined, isLoading: false }
  },
}))

const makeProfile = (overwrite: object = {}) => ({
  profile: {
    resolverAddress: RESOLVER_ADDRESSES['1'][0],
  },
  isLoading: false,
  ...overwrite,
})
const mockUseProfile = jest.fn().mockReturnValue(makeProfile())
jest.mock('@app/hooks/useProfile', () => ({
  useProfile: (_: string, options: any) => {
    if (options?.skip ?? false) return { data: undefined, loading: false }
    return mockUseProfile()
  },
}))

const makeMockRegistryResolver = (overwrite: object = {}) => ({
  data: RESOLVER_ADDRESSES['1'][0],
  isLoading: false,
  isSuccess: true,
  ...overwrite,
})
const mockUseRegistryResolver = jest.fn().mockReturnValue(makeMockRegistryResolver())
jest.mock('@app/hooks/resolver/useRegistryResolver', () => ({
  useRegistryResolver: (_: string, options: any) => {
    if (options?.enabled ?? true) return mockUseRegistryResolver()
    return { data: undefined, isLoading: false }
  },
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('useResolverType', () => {
  it('should return type is latest for base mock data', () => {
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { type: 'latest' },
      isLoading: false,
    })
    expect(mockUseBasicName).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseRegistryResolver).toHaveBeenCalled()
  })

  it('should return isLoading is false and data is undefined if enabled is false', () => {
    const { result } = renderHook(() => useResolverType('test.eth', { enabled: false }))
    expect(result.current).toEqual({
      data: undefined,
      isLoading: false,
    })
    expect(mockUseBasicName).not.toHaveBeenCalled()
    expect(mockUseProfile).not.toHaveBeenCalled()
    expect(mockUseRegistryResolver).not.toHaveBeenCalled()
  })

  it('should return isLoading is false and data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverType(''))
    expect(result.current).toEqual({
      data: undefined,
      isLoading: false,
    })
    expect(mockUseBasicName).not.toHaveBeenCalled()
    expect(mockUseProfile).not.toHaveBeenCalled()
    expect(mockUseRegistryResolver).not.toHaveBeenCalled()
  })

  it('should return isLoading is true and data is undefined if useBasicName is loading', () => {
    mockUseBasicName.mockReturnValueOnce(makeMocBasicName({ isLoading: true }))
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
    })
    expect(mockUseBasicName).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseRegistryResolver).toHaveBeenCalled()
  })

  it('should return isLoading is true and data is undefined if useRegistryResolve is loading', () => {
    mockUseRegistryResolver.mockReturnValueOnce(makeMockRegistryResolver({ isLoading: true }))
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
    })
    expect(mockUseBasicName).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseRegistryResolver).toHaveBeenCalled()
  })

  it('should return type is outdated if resolver is second latest', () => {
    mockUseProfile.mockReturnValueOnce({
      profile: {
        resolverAddress: RESOLVER_ADDRESSES['1'][1],
      },
      loading: false,
    })
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { type: 'outdated' },
      isLoading: false,
    })
    expect(mockUseBasicName).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseRegistryResolver).toHaveBeenCalled()
  })

  it('should return type is latest if resolver is second latest but name is not wrapped', () => {
    mockUseBasicName.mockReturnValueOnce(
      makeMocBasicName({
        profile: { resolverAddress: RESOLVER_ADDRESSES['1'][1] },
        isWrapped: false,
      }),
    )
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { type: 'latest' },
      isLoading: false,
    })
  })

  it('should return type is custom if resolver is not in resolver list', () => {
    mockUseProfile.mockReturnValueOnce(makeProfile({ profile: { resolverAddress: '0xresolver' } }))
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { type: 'custom' },
      isLoading: false,
    })
  })

  it('should return isWildcard is true if registry resolver is empty but profile resolver has value', () => {
    mockUseRegistryResolver.mockReturnValueOnce(makeMockRegistryResolver({ data: emptyAddress }))
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { isWildcard: true },
      isLoading: false,
    })
  })

  it('should return isWildcard is false if registry resolver is empty but profile resolver is also empty', () => {
    mockUseRegistryResolver.mockReturnValueOnce(makeMockRegistryResolver({ data: emptyAddress }))
    mockUseProfile.mockReturnValueOnce(makeProfile({ profile: { resolverAddress: emptyAddress } }))
    const { result } = renderHook(() => useResolverType('test.eth'))
    expect(result.current).toMatchObject({
      data: { isWildcard: false },
      isLoading: false,
    })
  })
})
