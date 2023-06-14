import { mockFunction, renderHook } from '@app/test-utils'

import { useSigner } from 'wagmi'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { useResolverIsAuthorized } from './useResolverIsAuthorized'

const mockSupportsInterface = jest.fn().mockReturnValue(Promise.resolve(true))
const mockEstimateGas = jest.fn().mockReturnValue(Promise.resolve(100000))

class Contract {
  supportsInterface: (...args: any[]) => Promise<boolean>

  estimateGas: {
    setAddr: () => Promise<number>
  }

  constructor() {
    this.supportsInterface = (...args) => {
      console.log('mockSupportsInterface')
      return mockSupportsInterface(...args)
    }
    this.estimateGas = {
      setAddr: () => mockEstimateGas(),
    }
  }
}

jest.mock('@ethersproject/contracts', () => ({
  Contract: jest.fn().mockImplementation(() => new Contract()),
}))

const makeUseSigner = (overwrite: object = {}) => ({
  data: {},
  isLoading: false,
  ...overwrite,
})
const mockUseSigner = mockFunction(useSigner)
mockUseSigner.mockReturnValue(makeUseSigner())

const makeProfile = (overwrite: object = {}) => ({
  profile: {
    resolverAddress: '0xresolver',
  },
  loading: false,
  ...overwrite,
})
const mockUseProfile = jest.fn().mockReturnValue(makeProfile)
jest.mock('@app/hooks/useProfile', () => ({
  useProfile: (_: string, options: any = {}) => {
    if (options.skip) return { data: undefined, loading: false }
    return mockUseProfile()
  },
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('useResolverIsAuthorized', () => {
  it('should return isValid and isAuthorized is true if resolver is known and name is not wrapped', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        resolverAddress: RESOLVER_ADDRESSES['1'][0],
      },
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: false }),
    )
    await waitForNextUpdate()
    expect(result.current).toMatchObject({
      isLoading: false,
      data: {
        isAuthorized: true,
        isValid: true,
      },
    })
  })

  it('should return isValid and isAuthorized is false if resolver is not namewrapper aware and name is wrapped', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        resolverAddress: RESOLVER_ADDRESSES['1'][1],
      },
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: true }),
    )
    await waitForNextUpdate()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(result.current).toMatchObject({
      isLoading: false,
      data: {
        isAuthorized: false,
        isValid: true,
      },
    })
  })

  it('should return isValid and isAuthorized is true if resolver is namewrapper aware and name is wrapped', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        resolverAddress: RESOLVER_ADDRESSES['1'][1],
      },
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: true }),
    )
    await waitForNextUpdate()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(result.current).toMatchObject({
      isLoading: false,
      data: {
        isAuthorized: false,
        isValid: true,
      },
    })
  })

  it('should return correct results with base mock data', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: false }),
    )
    mockUseProfile.mockReturnValue({
      profile: {
        resolverAddress: '0xresolver',
      },
      loading: false,
    })
    await waitForNextUpdate()
    expect(mockSupportsInterface).toHaveBeenCalled()
    expect(mockEstimateGas).toHaveBeenCalled()
    expect(mockUseSigner).toHaveBeenCalled()
    expect(mockUseProfile).toHaveBeenCalled()
    expect(result.current).toMatchObject({
      isLoading: false,
      data: {
        isAuthorized: true,
        isValid: true,
      },
    })
  })

  it('should return false false if checkInterface rejects', async () => {
    mockSupportsInterface.mockReturnValueOnce(Promise.reject(new Error('error')))
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: false }),
    )
    await waitForNextUpdate()
    expect(result.current).toMatchObject({
      data: {
        isAuthorized: false,
        isValid: false,
      },
      isLoading: false,
    })
  })

  it('should return false false if checkInterface rejects', async () => {
    mockEstimateGas.mockReturnValueOnce(Promise.reject(new Error('notAuthorized')))
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized({ name: 'test.eth', isWrapped: false }),
    )
    await waitForNextUpdate()
    expect(result.current).toMatchObject({
      data: {
        isAuthorized: false,
        isValid: true,
      },
      isLoading: false,
    })
  })

  it('should return data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverIsAuthorized({}))
    expect(result.current).toMatchObject({ isLoading: false, data: undefined })
  })
})
