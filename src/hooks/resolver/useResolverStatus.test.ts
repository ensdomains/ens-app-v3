import { expectEnabledHook, mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { Profile } from '@app/types/index'
import { emptyAddress } from '@app/utils/constants'
import { makeEthRecordItem, mergeAddressRecords } from '@app/utils/records'

import { useProfile } from '../useProfile'
import { useResolverIsAuthorised } from './useResolverIsAuthorised'
import { useResolverType } from './useResolverType'

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/resolver/useResolverType')
vi.mock('@app/hooks/resolver/useResolverIsAuthorised')
vi.mock('@app/hooks/chain/useContractAddress')

const mockUseProfileBase = mockFunction(useProfile)
const mockUseProfile = mockFunction<typeof useProfile>(vi.fn())
const mockUseLatestResolverProfile = mockFunction<typeof useProfile>(vi.fn())

const mockUseResolverType = mockFunction(useResolverType)
const mockUseResolverIsAuthorised = mockFunction(useResolverIsAuthorised)
const mockUseContractAddress = mockFunction(useContractAddress)

const createProfileData = ({
  texts: _texts,
  coinTypes: _coinTypes,
  contentHash: _contentHash,
  abi: _abi,
  resolverAddress: _resolverAddress,
}: {
  texts?: { key: string; value: string }[]
  coinTypes?: { id: number; name: string; value: string }[]
  contentHash?: { protocolType: string; decoded: string }
  abi?: Profile['abi']
  resolverAddress?: string
} = {}) => {
  const texts = Object.entries(
    [{ key: 'test', value: 'test' }, ...(_texts || [])].reduce((acc, { key, value }) => ({
      ...acc,
      [key]: value,
    })),
  ).map(([key, value]) => ({ key, value, type: 'text' }))
  const coins = mergeAddressRecords([makeEthRecordItem('0x123')], _coinTypes)
  const contentHash = _contentHash || { protocolType: 'ipfs', decoded: '0x123' }
  const abi = _abi || { contentType: 1, decoded: true, abi: '[{}]' }
  const resolverAddress = _resolverAddress ?? KNOWN_RESOLVER_DATA['1']![0].address
  return {
    abi,
    texts,
    coins,
    contentHash,
    resolverAddress,
  } as Profile
}

const createResult = (keys?: string[], isLoading = false) => ({
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

beforeEach(() => {
  vi.clearAllMocks()
  mockUseProfileBase.mockImplementation((args) => {
    if (args.resolverAddress) return mockUseLatestResolverProfile(args)
    return mockUseProfile(args)
  })
  mockUseProfile.mockReturnValue({ data: createProfileData(), isLoading: false })
  mockUseLatestResolverProfile.mockReturnValue({ data: createProfileData(), isLoading: false })
  // @ts-ignore
  mockUseContractAddress.mockReturnValue('0xlatest')
  mockUseResolverIsAuthorised.mockReturnValue({
    data: { isAuthorised: true, isValid: true },
    isLoading: false,
  })
  mockUseResolverType.mockReturnValue({ data: { type: 'latest' }, isLoading: false })
})

describe('useResolverStatus', () => {
  it('should return expected values for base mock data', () => {
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult([
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
    // first useProfile call
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, false)
    // second useProfile call - for latest resolver profile
    expectEnabledHook(mockUseLatestResolverProfile, false)
  })

  it('should return data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverStatus({ name: '' }))
    expect(result.current).toMatchObject(
      expect.objectContaining({ data: undefined, isLoading: false }),
    )
    expectEnabledHook(mockUseProfile, false)
    expectEnabledHook(mockUseResolverType, false)
    expectEnabledHook(mockUseResolverIsAuthorised, false)
    expectEnabledHook(mockUseLatestResolverProfile, false)
  })

  it('should return data is undefined if enabled is false', () => {
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth', enabled: false }))
    expect(result.current).toMatchObject(
      expect.objectContaining({ data: undefined, isLoading: false }),
    )
    expectEnabledHook(mockUseProfile, false)
    expectEnabledHook(mockUseResolverType, false)
    expectEnabledHook(mockUseResolverIsAuthorised, false)
    expectEnabledHook(mockUseLatestResolverProfile, false)
  })

  it('should not return hasLatestResolver is true if resolverType is not latest', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
        'isNameWrapperAware',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should not return isMigratedProfileEqual is true if latest resolver profile does not match', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      data: createProfileData({ texts: [{ key: 'nickname', value: 'Rumpleskilskin' }] }),
      isLoading: false,
    })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should return hasMigratedRecord is true if migratedRecordsMatch matches on latest resolver profile', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      data: createProfileData({ coinTypes: [{ id: 60, name: 'ETH', value: '0xotheraddress' }] }),
      isLoading: false,
    })
    const { result } = renderHook(() =>
      useResolverStatus({
        name: 'test.eth',
        migratedRecordsMatch: { type: 'address', match: { id: 60, value: '0xotheraddress' } },
      }),
    )
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
        'hasMigratedRecord',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should return hasMigratedRecord is false if migratedRecordsMatch does not match on latest resolver profile', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      data: createProfileData({ coinTypes: [{ id: 60, name: 'ETH', value: '0xothermatch' }] }),
      isLoading: false,
    })
    const { result } = renderHook(() =>
      useResolverStatus({
        name: 'test.eth',
        migratedRecordsMatch: { type: 'address', match: { id: 60, value: '0xotheraddress' } },
      }),
    )
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isNameWrapperAware',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should not return hasMigratedProfile if latest resolver profile does not have records', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseLatestResolverProfile.mockReturnValueOnce({
      data: { resolverAddress: KNOWN_RESOLVER_DATA['1']![0].address },
      isLoading: false,
    })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'isNameWrapperAware',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should not call useProfile for latest resolver if skipCompare option is true', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth', compare: false }))
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'isNameWrapperAware',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, false)
  })

  it('should call useProfile for latest resolver if current resolver address is empty address', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseProfile.mockReturnValueOnce({
      isLoading: false,
      data: createProfileData({ resolverAddress: emptyAddress }),
    })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult([
        'hasProfile',
        'hasValidResolver',
        'isAuthorized',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
      ]),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })

  it('should call useProfile for latest resolver if current resolver address is empty string', () => {
    mockUseResolverType.mockReturnValueOnce({ data: { type: 'outdated' } })
    mockUseProfile.mockReturnValueOnce({
      isLoading: false,
      data: createProfileData({ resolverAddress: '' }),
    })
    mockUseResolverIsAuthorised.mockReturnValueOnce({
      data: { isAuthorised: false, isValid: false },
      isLoading: false,
    })
    const { result } = renderHook(() => useResolverStatus({ name: 'test.eth' }))
    expect(result.current).toMatchObject(
      createResult(['hasProfile', 'hasMigratedProfile', 'isMigratedProfileEqual']),
    )
    expectEnabledHook(mockUseProfile, true)
    expectEnabledHook(mockUseResolverType, true)
    expectEnabledHook(mockUseResolverIsAuthorised, true)
    expectEnabledHook(mockUseLatestResolverProfile, true)
  })
})
