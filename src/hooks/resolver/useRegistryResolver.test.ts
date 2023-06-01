import { renderHook } from '@app/test-utils'

import { useRegistryResolver } from './useRegistryResolver'

const mockUseEns = jest.fn()
jest.mock('@app/utils/EnsProvider', () => ({
  useEns: () => mockUseEns(),
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('useRegistryResolver', () => {
  it('should return data is undefined and isLoading is false if enabled is false', () => {
    mockUseEns.mockReturnValue({ ready: true })
    const { result } = renderHook(() => useRegistryResolver('test.eth', { enabled: false }))
    expect(result.current).toMatchObject({ isLoading: false, data: undefined })
  })

  it('should return return data is undefined and isLoading is false if ready is false', () => {
    mockUseEns.mockReturnValue({ ready: false })
    const { result } = renderHook(() => useRegistryResolver('test.eth'))
    expect(result.current).toMatchObject({ isLoading: false, data: undefined })
  })

  it('should return return data is undefined and isLoading is false if name is empty', async () => {
    mockUseEns.mockReturnValue({ ready: true })
    const { result } = renderHook(() => useRegistryResolver(''))
    expect(result.current).toMatchObject({ isLoading: false, data: undefined })
  })

  it('should return return data if query function resolvers', async () => {
    mockUseEns.mockReturnValue({
      ready: true,
      contracts: {
        getRegistry: () =>
          Promise.resolve({
            resolver: () => Promise.resolve('0x123'),
          }),
      },
    })
    const { result, waitForNextUpdate } = renderHook(() => useRegistryResolver('test.eth'))
    await waitForNextUpdate()
    expect(result.current).toMatchObject({ isLoading: false, data: '0x123' })
  })

  it('should return return data is null if query function rejects', async () => {
    mockUseEns.mockReturnValue({
      ready: true,
      contracts: {
        getRegistry: () =>
          Promise.resolve({
            resolver: () => Promise.reject(new Error('error')),
          }),
      },
    })
    const { result, waitForNextUpdate } = renderHook(() => useRegistryResolver('hello.eth'))
    await waitForNextUpdate()
    expect(result.current).toMatchObject({ isLoading: false, data: undefined, isError: true })
  })
})
