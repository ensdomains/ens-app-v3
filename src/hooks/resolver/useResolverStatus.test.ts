import { mockFunction, renderHook } from '@app/test-utils'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { RecordItem, ReturnedENS } from '@app/types/index'
import { NAMEWRAPPER_AWARE_RESOLVERS, emptyAddress } from '@app/utils/constants'
import { makeEthRecordItem, mergeRecords } from '@app/utils/records'

const makeProfile = ({
  texts: _texts,
  coinTypes: _coinTypes,
  contentHash: _contentHash,
  abi: _abi,
  resolverAddress: _resolverAddress,
}: {
  texts?: { key: string; value: string }[]
  coinTypes?: { key: string; coin: string; addr: string }[]
  contentHash?: { protocolType: string; decoded: string }
  abi?: { contentType: number; data: string }
  resolverAddress?: string
}) => {
  const texts = Object.entries(
    [{ key: 'test', value: 'test' }, ...(_texts || [])].reduce((acc, { key, value }) => ({
      ...acc,
      [key]: value,
    })),
  ).map(([key, value]) => ({ key, value, type: 'text' }))
  const coinTypes = mergeRecords(
    [makeEthRecordItem('0x123')],
    _coinTypes as unknown as RecordItem[],
  )
  const contentHash = _contentHash || { protocolType: 'ipfs', decoded: '0x123' }
  const abi = _abi || { contentType: 1, data: '[{}]' }
  const resolverAddress = _resolverAddress ?? NAMEWRAPPER_AWARE_RESOLVERS['1'][0]
  return {
    records: {
      texts,
      coinTypes,
      contentHash,
      abi,
    },
    resolverAddress,
  } as unknown as ReturnedENS['getProfile']
}

const mockBasicName = jest.fn().mockReturnValue({ isWrapped: false, isLoading: false })
jest.mock('@app/hooks/useBasicName', () => ({
  useBasicName: (_: string, options: any) => {
    if (options?.enabled ?? true) return mockBasicName()
    return { data: undefined, isLoading: false }
  },
}))

const mockUseLatestResolverProfile = jest
  .fn()
  .mockReturnValue({ loading: false, profile: makeProfile({}) })
const mockUseProfile = jest.fn().mockReturnValue({ loading: false, profile: makeProfile({}) })
jest.mock('@app/hooks/useProfile', () => ({
  useProfile: jest.fn().mockImplementation((_, options = {}) => {
    if (options?.skip) return { data: undefined, loading: false }
    if (options?.resolverAddress) {
      return mockUseLatestResolverProfile()
    }
    return mockUseProfile()
  }),
}))

jest.mock('@app/hooks/useContractAddress')
const mockUseContractAddress = mockFunction(useContractAddress)
mockUseContractAddress.mockReturnValue('0xlatest')

const mockUseResolverIsAuthorized = jest.fn().mockReturnValue({
  data: { isAuthorized: true, isValid: true },
  isLoading: false,
})
jest.mock('@app/hooks/resolver/useResolverIsAuthorized', () => ({
  useResolverIsAuthorized: (_: string, options: any) => {
    if (options?.enabled ?? true) return mockUseResolverIsAuthorized()
    return { data: undefined, isLoading: false }
  },
}))

const mockUseResolverType = jest.fn().mockReturnValue({ data: { type: 'latest' } })
jest.mock('@app/hooks/resolver/useResolverType', () => ({
  useResolverType: (_: string, options: any) => {
    if (options?.enabled ?? true) return mockUseResolverType()
    return { data: undefined, isLoading: false }
  },
}))

const makeResult = (keys?: string[], isLoading = false) => ({
  data: {
    hasResolver: false,
    hasLatestResolver: false,
    hasValidResolver: false,
    isAuthorized: false,
    hasProfile: false,
    hasMigratedProfile: false,
    isMigratedProfileEqual: false,
    isNameWrapperAware: false,
    ...(keys || []).reduce((acc, key) => {
      return {
        ...acc,
        [key]: true,
      }
    }, {}),
  },
  isLoading,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useResolverStatus', () => {
  it('should return expected values for base mock data', () => {
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult([
        'hasLatestResolver',
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).not.toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).not.toHaveBeenCalled()
  })

  it('should return data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverStatus(''))
    expect(result.current).toMatchObject({ data: undefined, isLoading: false })
    expect(mockUseProfile).not.toHaveBeenCalled()
    expect(mockUseResolverType).not.toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).not.toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).not.toHaveBeenCalled()
  })

  it('should return data is undefined if enabled is false', () => {
    const { result } = renderHook(() => useResolverStatus('test.eth', { enabled: false }))
    expect(result.current).toMatchObject({ data: undefined, isLoading: false })
    expect(mockUseProfile).not.toHaveBeenCalled()
    expect(mockUseResolverType).not.toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).not.toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).not.toHaveBeenCalled()
  })

  it('should not return hasLatestResolver is true if resolverType is not latest', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should not return isMigratedProfileEqual is true if latest resolver profile does not match', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      profile: makeProfile({ texts: [{ key: 'nickname', value: 'Rumpleskilskin' }] }),
      loading: false,
    })
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should return hasMigratedRecord is true if migratedRecordsMatch matches on latest resolver profile', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      profile: makeProfile({ coinTypes: [{ key: '60', coin: 'ETH', addr: '0xotheraddress' }] }),
      loading: false,
    })
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', {
        migratedRecordsMatch: { key: '60', type: 'addr', addr: '0xotheraddress' },
      }),
    )
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
        'hasMigratedRecord',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should return hasMigratedRecord is false if migratedRecordsMatch does not match on latest resolver profile', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      profile: makeProfile({ coinTypes: [{ key: '60', coin: 'ETH', addr: '0xothermatch' }] }),
      loading: false,
    })
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', {
        migratedRecordsMatch: { key: '60', type: 'addr', addr: '0xotheraddress' },
      }),
    )
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should not return hasMigratedProfile if latest resolver profile does not have records', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      data: { records: {}, resolverAddress: NAMEWRAPPER_AWARE_RESOLVERS['1'][0] },
      isLoading: false,
    })
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should not call mockUseLatestResolverProfile if skipCompare option is true', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    const { result } = renderHook(() => useResolverStatus('test.eth', { skipCompare: true }))
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'isNameWrapperAware',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).not.toHaveBeenCalled()
  })

  it('should call mockUseLatestResolverProfile if current resolver address is empty address', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseProfile.mockReturnValueOnce({
      loading: false,
      profile: makeProfile({ resolverAddress: emptyAddress }),
    })
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult([
        'hasProfile',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
      ]),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })

  it('should call mockUseLatestResolverProfile if current resolver address is empty string', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseProfile.mockReturnValueOnce({
      loading: false,
      profile: makeProfile({ resolverAddress: '' }),
    })
    mockUseResolverIsAuthorized.mockReturnValueOnce({
      data: { isAuthorized: false, isValid: false },
      isLoading: false,
    })
    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toMatchObject(
      makeResult(['hasProfile', 'hasMigratedProfile', 'isMigratedProfileEqual']),
    )
    expect(mockUseProfile).toHaveBeenCalled()
    expect(mockUseResolverType).toHaveBeenCalled()
    expect(mockUseResolverIsAuthorized).toHaveBeenCalled()
    expect(mockUseLatestResolverProfile).toHaveBeenCalled()
  })
})
