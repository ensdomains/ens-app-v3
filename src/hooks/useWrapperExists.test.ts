import { mockFunction, renderHook } from '@app/test-utils'
import { useEns } from '@app/utils/EnsProvider'
import { useChainId } from './useChainId'
import { useWrapperExists } from './useWrapperExists'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useChainId')

const mockUseEns = mockFunction(useEns)
const mockUseChainId = mockFunction(useChainId)

const mockGetContractAddress = jest.fn()

describe('useWrapperExists', () => {
  mockUseChainId.mockReturnValue(1)
  mockGetContractAddress.mockReturnValue(() => '0x123')
  it('should return false if ENS not ready', () => {
    mockUseEns.mockReturnValue({
      ready: false,
      getContractAddress: mockGetContractAddress,
    })
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return false if nameWrapper address is undefined', () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => undefined)
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return false if nameWrapper address is empty address', () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => '0x0000000000000000000000000000000000000000')
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return true if nameWrapper address is not empty address', () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => '0x123')
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(true)
  })
})
