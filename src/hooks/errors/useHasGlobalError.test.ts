import { renderHook } from '@testing-library/react-hooks'

import { useGlobalErrorState } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

import { mockFunction } from '../../test-utils'
import { useHasGlobalError } from './useHasGlobalError'

type Error = 'ENSJUnknowError' | 'ENSJSNetworkLatencyError' | 'ENSJSSubgraphError'
const makeGlobalErrorState = (errors: Error[], hasSubgraphError = false) => {
  return {
    errors: Object.fromEntries(
      errors.map((key, i) => [`key${i}`, { key: [`key${i}`], type: key }]),
    ),
    activeHashes: errors.map((_, i) => `key${i}`),
    meta: {
      hasSubgraphError,
    },
  }
}

jest.mock('@app/utils/GlobalErrorProvider/GlobalErrorProvider')
const mockUseGlobalErrorState = mockFunction(useGlobalErrorState)

describe('useHasGlobalError', () => {
  it('should return false if there are no errors', () => {
    mockUseGlobalErrorState.mockReturnValue(makeGlobalErrorState([]))
    const { result } = renderHook(() => useHasGlobalError())
    expect(result.current).toBe(false)
  })

  it('should return true if there are no errors and hasSubgraphError is true', () => {
    mockUseGlobalErrorState.mockReturnValue(makeGlobalErrorState([], true))
    const { result } = renderHook(() => useHasGlobalError())
    expect(result.current).toBe(true)
  })

  it('should return true if there are errors', () => {
    mockUseGlobalErrorState.mockReturnValue(makeGlobalErrorState(['ENSJSSubgraphError']))
    const { result } = renderHook(() => useHasGlobalError())
    expect(result.current).toBe(true)
  })

  it('should return false if the error is ENSJNetworkLatencyError', () => {
    mockUseGlobalErrorState.mockReturnValue(makeGlobalErrorState(['ENSJSNetworkLatencyError']))
    const { result } = renderHook(() => useHasGlobalError())
    expect(result.current).toBe(false)
  })

  it('should return false if the error is ENSJNetworkLatencyError', () => {
    mockUseGlobalErrorState.mockReturnValue(makeGlobalErrorState(['ENSJSNetworkLatencyError']))
    const { result } = renderHook(() => useHasGlobalError(true))
    expect(result.current).toBe(true)
  })
})
