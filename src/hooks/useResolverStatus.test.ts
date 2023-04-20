import { mockFunction, renderHook } from '@app/test-utils'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useEns } from '../utils/EnsProvider'
import { useContractAddress } from './useContractAddress'
import { useResolverStatus } from './useResolverStatus'

jest.mock('@app/utils/EnsProvider')
jest.mock('@app/utils/cacheKeyFactory')
jest.mock('@app/hooks/useContractAddress')

const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseEns = mockFunction(useEns)
const mockCacheKeyFactory = mockFunction(useQueryKeys)

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
  mockUseContractAddress.mockReturnValue(overrides?.useContractAddress || 'latest_resolver')

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
  beforeEach(() => {
    mockCacheKeyFactory.mockReturnValue({ resolverStatus: () => ['cacheKey'] })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return hasResolver is false if profile does not have resolver', async () => {
    setup()

    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverStatus('test.eth', { resolverAddress: undefined } as any),
    )
    await waitForNextUpdate()
    expect(result.current).toEqual({
      data: {
        hasResolver: false,
        hasLatestResolver: false,
        hasMigratedProfile: false,
        isMigratedProfileEqual: false,
      },
      isLoading: false,
      isFetching: false,
    })
  })

  it('should return hasLatestResolver is true if profile has the latest resolver', async () => {
    setup()

    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverStatus('test.eth', { resolverAddress: 'latest_resolver' } as any),
    )
    await waitForNextUpdate()
    expect(result.current).toEqual({
      data: {
        hasResolver: true,
        hasLatestResolver: true,
        hasMigratedProfile: true,
        isMigratedProfileEqual: true,
      },
      isLoading: false,
      isFetching: false,
    })
  })

  describe('when profile does NOT have the latest resolver', () => {
    it('should return hasLatestResolver is false', async () => {
      setup()
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('another_resolver.eth', defaultProfile as any),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        },
        isLoading: false,
        isFetching: false,
      })
    })

    it('should return hasMigratedProfile and hasCreatedProfile is false if getProfile returns undefined', async () => {
      setup({
        getProfile: undefined,
      })
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('test.eth', defaultProfile as any),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        },
        isLoading: false,
        isFetching: false,
      })
    })

    it('should return hasCreatedProfile is false if getProfile returns records with an empty object ', async () => {
      setup({
        getProfile: {
          records: {},
        },
      })
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('test.eth', defaultProfile as any),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        },
        isLoading: false,
        isFetching: false,
      })
    })

    it('should return hasMigratedProfile is true if getProfile returns different records from useProfile ', async () => {
      setup({
        getProfile: {
          records: {
            texts: [
              {
                key: 'different',
                value: 'value',
              },
            ],
          },
        },
      })
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('test.eth', defaultProfile as any),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: true,
          isMigratedProfileEqual: false,
        },
        isLoading: false,
        isFetching: false,
      })
    })

    it('should return isMigratedProfileEqual is true if getProfile returns the same records as useProfile ', async () => {
      setup({
        getProfile: defaultProfile,
      })
      const { result, waitForNextUpdate, rerender } = renderHook(() =>
        useResolverStatus('test.eth', defaultProfile as any),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: true,
          isMigratedProfileEqual: true,
        },
        isLoading: false,
        isFetching: false,
      })
    })
  })

  describe('when using skipCompare flag in options', () => {
    it('should NOT compare resolver profiles if skipCompare is true', async () => {
      setup({
        getProfile: defaultProfile,
      })
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverStatus('test.eth', defaultProfile as any, { skipCompare: true }),
      )
      await waitForNextUpdate()
      expect(result.current).toEqual({
        data: {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        },
        isLoading: false,
        isFetching: false,
      })
    })
  })

  it('should compare resolver profiles if skipCompare is false', async () => {
    setup({
      getProfile: defaultProfile,
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverStatus('test.eth', defaultProfile as any, { skipCompare: false }),
    )
    await waitForNextUpdate()
    expect(result.current).toEqual({
      data: {
        hasResolver: true,
        hasLatestResolver: false,
        hasMigratedProfile: true,
        isMigratedProfileEqual: true,
      },
      isLoading: false,
      isFetching: false,
    })
  })
})
