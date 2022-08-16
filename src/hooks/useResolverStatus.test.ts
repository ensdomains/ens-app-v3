import { mockFunction, renderHook } from '@app/test-utils'
import { useProfile } from './useProfile'
import { usePublicResolverAddress } from './usePublicResolverAddress'
import { useResolverStatus } from './useResolverStatus'
import { useEns } from '../utils/EnsProvider'

jest.mock('@app/utils/EnsProvider')
jest.mock('@app/hooks/usePublicResolverAddress')
jest.mock('@app/hooks/useProfile')

const mockUsePublicResolver = mockFunction(usePublicResolverAddress)
const mockUseProfile = mockFunction(useProfile)
const mockUseEns = mockFunction(useEns)

const mockLocalStorage = jest.fn()
const mockGetItem = jest.fn()
const mockGetProfile = jest.fn()

const defaultProfile = {
  records: {
    texts: [
      {
        key: 'test',
        value: 'test',
        type: 'text',
      },
    ],
    coinTypes: [
      {
        coin: 'ETH',
        addr: '0x123',
        type: 'addr',
        key: '60',
      },
    ],
    contentHash: {
      protocolType: 'ipfs',
      decoded: '0x123',
    },
  },
  resolverAddress: 'another_resolver',
}

const setup = (overrides?: any) => {
  mockUsePublicResolver.mockReturnValue(
    overrides?.usePublicResolver || {
      loading: false,
      address: 'latest_resolver' ,
    },
  )

  mockUseProfile.mockReturnValue(
    overrides?.useProfile || {
      profile: defaultProfile,
      loading: false,
    },
  )

  mockUseEns.mockReturnValue({
    getProfile: mockGetProfile,
    ready: true,
  })

  mockGetProfile.mockReturnValue(overrides?.getProfile)

  mockLocalStorage.mockReturnValue({
    getItem: mockGetItem,
  })
  window.localStorage = mockLocalStorage()

  mockGetItem.mockReturnValue(overrides?.getItem || '')
}

describe('useResolverStatus', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return hasLatestResolver is true if profile has the latest resolver', async () => {
    setup({
      useProfile: {
        profile: { resolverAddress: 'latest_resolver' },
        loading: false,
      },
    })

    const { result } = renderHook(() => useResolverStatus('test.eth'))
    expect(result.current).toEqual({
      status: {
        hasLatestResolver: true,
        hasMigratedProfile: true,
        hasCreatedProfile: true,
      },
      loading: false,
    })
  })

  describe('when profile does NOT have the latest resolver', () => {
    it('should return hasLatestResolver is false', async () => {
      setup()
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('another_resolver.eth'),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        status: {
          hasLatestResolver: false,
          hasMigratedProfile: false,
          hasCreatedProfile: false,
        },
        loading: false,
      })
    })

    it('should return hasMigratedProfile and hasCreatedProfile is false if getProfile returns undefined', async () => {
      setup({
        getProfile: undefined,
      })
      const { result, waitForNextUpdate } = renderHook(() => useResolverStatus('test.eth'))
      await waitForNextUpdate()
      expect(result.current).toEqual({
        status: {
          hasLatestResolver: false,
          hasMigratedProfile: false,
          hasCreatedProfile: false,
        },
        loading: false,
      })
    })

    it('should return hasCreatedProfile is true if getProfile returns a value ', async () => {
      setup({
        getProfile: {},
      })
      const { result, waitForNextUpdate } = renderHook(() => useResolverStatus('test.eth'))
      await waitForNextUpdate()
      expect(result.current).toEqual({
        status: {
          hasLatestResolver: false,
          hasMigratedProfile: false,
          hasCreatedProfile: true,
        },
        loading: false,
      })
    })

    it('should return hasMigratedProfile is true if getProfile returns the same records as useProfile ', async () => {
      setup({
        getProfile: defaultProfile,
      })
      const { result, waitForNextUpdate } = renderHook(() => useResolverStatus('test.eth'))
      await waitForNextUpdate()
      expect(result.current).toEqual({
        status: {
          hasLatestResolver: false,
          hasMigratedProfile: true,
          hasCreatedProfile: true,
        },
        loading: false,
      })
    })
  })

  describe('when using skipCompare flag in options', () => {
    it('should NOT compare resolver profiles if skipCompare is true', async () => {
      setup({
        getProfile: defaultProfile,
      })
      const { result } = renderHook(() =>
        useResolverStatus('test.eth', false, { skipCompare: true }),
      )
      // await waitForNextUpdate()
      expect(result.current).toEqual({
        status: {
          hasLatestResolver: false,
          hasMigratedProfile: false,
          hasCreatedProfile: false,
        },
        loading: false,
      })
    })
  })

  it('should compare resolver profiles if skipCompare is false', async () => {
    setup({
      getProfile: defaultProfile,
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverStatus('test.eth', false, { skipCompare: false }),
    )
    await waitForNextUpdate()
    expect(result.current).toEqual({
      status: {
        hasLatestResolver: false,
        hasMigratedProfile: true,
        hasCreatedProfile: true,
      },
      loading: false,
    })
  })
})
