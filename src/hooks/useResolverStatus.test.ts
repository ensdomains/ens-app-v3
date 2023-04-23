import { mockFunction, renderHook } from '@app/test-utils'

import { NAMEWRAPPER_AWARE_RESOLVERS, emptyAddress } from '@app/utils/constants'

import { ReturnedENS } from '../types/index'
import { useChainId } from './useChainId'
import { useContractAddress } from './useContractAddress'
import { useProfile } from './useProfile'
import { useResolverIsAuthorized } from './useResolverIsAuthorized'
import { useResolverStatus } from './useResolverStatus'

const makeProfile = ({
  texts: _texts,
  coinTypes: _coinTypes,
  contentHash: _contentHash,
  abi: _abi,
  resolverAddress: _resolverAddress,
}: {
  texts?: { key: string; value: string }[]
  coinTypes?: { coin: string; addr: string }[]
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
  const coinTypes = Object.entries(
    [{ coin: 'ETH', addr: '0x123' }, ...(_coinTypes || [])].reduce((acc, { coin, addr }) => ({
      ...acc,
      [coin]: addr,
    })),
  ).map(([coin, addr]) => ({ coin, addr, type: 'addr' }))
  const contentHash = _contentHash || { protocolType: 'ipfs', decoded: '0x123' }
  const abi = _abi || { contentType: 1, data: '[{}]' }
  const resolverAddress = typeof _resolverAddress === 'undefined' ? '0xresolver' : _resolverAddress
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

jest.mock('@app/hooks/useProfile')
const mockUseProfile = mockFunction(useProfile)
mockUseProfile.mockReturnValue({
  loading: false,
  profile: makeProfile({}),
})

jest.mock('@app/hooks/useContractAddress')
const mockUseContractAddress = mockFunction(useContractAddress)
mockUseContractAddress.mockReturnValue('0xlatest')

jest.mock('@app/hooks/useChainId')
const mockUseChainId = mockFunction(useChainId)
mockUseChainId.mockReturnValue(1)

jest.mock('@app/hooks/useResolverIsAuthorized')
const mockUseResolverIsAuthorized = mockFunction(useResolverIsAuthorized)
mockUseResolverIsAuthorized.mockReturnValue({
  isAuthorized: true,
  isValid: true,
  isLoading: false,
})

const makeResult = (keys?: string[], isLoading = false) => ({
  status: {
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

describe('useResolverStatus', () => {
  afterEach(() => {})

  describe('missing parameters', () => {
    it('should return default values if no name is passed', () => {
      const { result } = renderHook(() => useResolverStatus('', makeProfile({})))
      expect(result.current).toEqual(makeResult())
    })

    it('should return default values if no profile is passed', () => {
      const { result } = renderHook(() => useResolverStatus('test.eth', undefined as any))
      expect(result.current).toEqual(makeResult())
    })
  })

  describe('loading', () => {
    it('should return isLoading true if useResolverIsAuthorized loading', () => {
      mockUseResolverIsAuthorized.mockReturnValueOnce({
        isAuthorized: true,
        isLoading: true,
      })
      const { result } = renderHook(() =>
        useResolverStatus('test.eth', makeProfile({}), { skipCompare: false }),
      )
      expect(result.current).toEqual(makeResult(['hasResolver', 'hasProfile'], true))
    })
  })

  it('should return default if profile does not have resolver', () => {
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', makeProfile({ resolverAddress: '' }), { skipCompare: false }),
    )
    expect(result.current).toEqual(makeResult())
  })

  it('should return default if profile resolver is empty address', () => {
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', makeProfile({ resolverAddress: emptyAddress }), {
        skipCompare: false,
      }),
    )
    expect(result.current).toEqual(makeResult())
  })

  it('should return authorized results if skipCompare is true', () => {
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', makeProfile({}), { skipCompare: true }),
    )
    expect(result.current).toEqual(
      makeResult(['hasResolver', 'hasValidResolver', 'isAuthorized', 'hasProfile']),
    )
  })

  it('should return isAuthorized is false if authorization fails', () => {
    mockUseResolverIsAuthorized.mockReturnValueOnce({
      isAuthorized: false,
      isValid: false,
      isLoading: false,
    })
    const { result } = renderHook(() =>
      useResolverStatus('test.eth', makeProfile({}), { skipCompare: true }),
    )
    expect(result.current).toEqual(makeResult(['hasResolver', 'hasProfile']))
  })

  it('should return isNameWrapperAware is true if resolver is in list', () => {
    const { result } = renderHook(() =>
      useResolverStatus(
        'test.eth',
        makeProfile({ resolverAddress: NAMEWRAPPER_AWARE_RESOLVERS[1][0] }),
        { skipCompare: true },
      ),
    )
    expect(result.current).toEqual(
      makeResult([
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasProfile',
        'isNameWrapperAware',
      ]),
    )
  })

  it('should return authorized results if latestResolverProfile is loading', () => {
    mockUseProfile.mockReturnValueOnce({
      loading: true,
      profile: makeProfile({}),
    })
    const { result } = renderHook(() => useResolverStatus('test.eth', makeProfile({})))
    expect(result.current).toEqual(
      makeResult(['hasResolver', 'hasValidResolver', 'isAuthorized', 'hasProfile'], true),
    )
  })

  it('should return isMigratedProfileEqual is false if profile is not equal to latestResolverProfile', () => {
    mockUseProfile.mockReturnValueOnce({
      loading: false,
      profile: makeProfile({ texts: [{ key: 'test', value: 'different' }] }),
    })
    const { result } = renderHook(() => useResolverStatus('test.eth', makeProfile({})))
    expect(result.current).toEqual(
      makeResult([
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasProfile',
        'hasMigratedProfile',
      ]),
    )
  })

  it('should return isMigratedProfileEqual is true if profile is equal to latestResolverProfile', () => {
    mockUseProfile.mockReturnValueOnce({
      loading: false,
      profile: makeProfile({}),
    })
    const { result } = renderHook(() => useResolverStatus('test.eth', makeProfile({})))
    expect(result.current).toEqual(
      makeResult([
        'hasResolver',
        'hasValidResolver',
        'isAuthorized',
        'hasProfile',
        'hasMigratedProfile',
        'isMigratedProfileEqual',
      ]),
    )
  })
})
