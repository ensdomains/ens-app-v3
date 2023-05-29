import { mockFunction, waitFor } from '@app/test-utils'

import { QueryClient } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { WagmiConfig, createClient, useProvider } from 'wagmi'

import { GlobalErrorState } from './GlobalErrorProvider'
import { useSubgraphMetaSync } from './useSubgraphMetaSync'

const makeGlobalErrorState = (hasSubgraphError = false, forceUpdate = false) => {
  return {
    meta: {
      hasSubgraphError,
      forceUpdate,
    },
  } as GlobalErrorState
}

const mockClientRequest = jest.fn()
jest.mock('@app/utils/EnsProvider', () => ({
  useEns: jest.fn().mockReturnValue({
    ready: true,
    gqlInstance: {
      client: {
        request: () => mockClientRequest(),
      },
    },
  }),
}))

const mockUseProvider = mockFunction(useProvider)
mockUseProvider.mockReturnValue({
  getBlock: () => Promise.resolve({ timestamp: 1 }),
})

const mockDispatch = jest.fn()

const createWrapper = () => {
  const wagmiClient = createClient({
    queryClient: new QueryClient(),
    provider: {} as any,
  })
  return ({ children }: any) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
describe('useMetaData', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })

  it('should not call mockDispatch if there is no global error state', () => {
    renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(), mockDispatch), {
      wrapper: createWrapper(),
    })
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should not call mockDispatch once meta returns hasIndexingError is false ', () => {
    mockClientRequest.mockResolvedValue({
      data: {
        _meta: { hasIndexingErrors: false },
        block: { number: 1 },
      },
    })
    renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true), mockDispatch), {
      wrapper: createWrapper(),
    })
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should call mockDispatch twice if meta returns hasIndexingError is true ', async () => {
    mockClientRequest.mockResolvedValue({
      _meta: { hasIndexingErrors: true, block: { number: 1 } },
    })
    renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true), mockDispatch), {
      wrapper: createWrapper(),
    })
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_META',
      payload: {
        hasSubgraphError: true,
        hasIndexingErrors: true,
      },
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_META',
      payload: { timestamp: 1 },
    })
  })

  it('should call mockDispatch once if force is true ', async () => {
    mockClientRequest.mockResolvedValue({
      _meta: { hasIndexingErrors: false, block: { number: 1 } },
    })
    renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true, true), mockDispatch), {
      wrapper: createWrapper(),
    })
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1)
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_META',
      payload: { hasIndexingErrors: false },
    })
  })
})
