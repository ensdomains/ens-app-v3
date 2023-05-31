import { mockFunction, renderHook } from '@app/test-utils'

import { useSigner } from 'wagmi'

import { useResolverIsAuthorized } from './useResolverIsAuthorized'

const mockSupportsInterface = jest.fn().mockReturnValue(Promise.resolve(true))
const mockEstimateGas = jest.fn().mockReturnValue(Promise.resolve(100000))
jest.mock('@ethersproject/contracts', () => ({
  Contract: jest.fn(() => ({
    supportsInterface: jest.fn(() => mockSupportsInterface()),
    estimateGas: {
      setAddr: jest.fn(() => mockEstimateGas()),
    },
  })),
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
  it('should return correct results with base mock data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useResolverIsAuthorized('test.eth'))
    await waitForNextUpdate()
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
    const { result, waitForNextUpdate } = renderHook(() => useResolverIsAuthorized('test.eth'))
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
    const { result, waitForNextUpdate } = renderHook(() => useResolverIsAuthorized('test.eth'))
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
    const { result } = renderHook(() => useResolverIsAuthorized(''))
    expect(result.current).toMatchObject({ isLoading: false, data: undefined })
  })

  it('should not call useProfile if resolverAddress option is defined', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useResolverIsAuthorized('test.eth', { resolverAddress: '0xresolver' }),
    )
    await waitForNextUpdate()
    expect(mockUseProfile).not.toHaveBeenCalled()
    expect(result.current).toMatchObject({
      data: {
        isAuthorized: true,
        isValid: true,
      },
      isLoading: false,
    })
  })
})
