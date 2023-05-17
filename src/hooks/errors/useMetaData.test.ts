import { mockFunction, waitFor } from '@app/test-utils'

import { renderHook } from '@testing-library/react-hooks'
import { useProvider } from 'wagmi'

import { GlobalErrorState } from '../../utils/GlobalErrorProvider'
import { useMetaData } from './useMetaData'

const makeGlobalErrorState = (hasSubgraphError = false) => {
  return {
    meta: {
      hasSubgraphError,
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

describe('useMetaData', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })

  it('should not call mockDispatch if there is no global error state', () => {
    renderHook(() => useMetaData(makeGlobalErrorState(), mockDispatch))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should not call mockDispatch once meta returns hasIndexingError is false ', () => {
    mockClientRequest.mockResolvedValue({
      data: {
        _meta: { hasIndexingErrors: false },
        block: { number: 1 },
      },
    })
    renderHook(() => useMetaData(makeGlobalErrorState(true), mockDispatch))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should call mockDispatch once if meta returns hasIndexingError is true ', async () => {
    mockClientRequest.mockResolvedValue({
      _meta: { hasIndexingErrors: true, block: { number: 1 } },
    })
    renderHook(() => useMetaData(makeGlobalErrorState(true), mockDispatch))
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_META',
      payload: { hasIndexingErrors: true },
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_META',
      payload: { timestamp: 1 },
    })
  })
})
