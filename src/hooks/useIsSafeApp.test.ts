import { renderHook, mockFunction, mockUseAccountReturnValue } from '@app/test-utils'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { checkIsSafeApp } from '@app/utils/safe'
import { useIsSafeApp } from './useIsSafeApp'

jest.mock('@app/utils/cacheKeyFactory')
jest.mock('@app/utils/safe')

describe('useIsSafeApp', () => {
  const mockUseQueryKeys = mockFunction(useQueryKeys)
  const mockCheckIsSafeApp = checkIsSafeApp as jest.MockedFunction<typeof checkIsSafeApp>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not run if connector is not defined', async () => {
    mockUseQueryKeys.mockReturnValue({ isSafeApp: () => ['key'] })
    mockUseAccountReturnValue.connector = false 
    const { result } = renderHook(() => useIsSafeApp())

    await new Promise(resolve => setTimeout(resolve, 500));

    expect(result.current.data).toBe(undefined)
    expect(mockCheckIsSafeApp).not.toHaveBeenCalled()
  })

  it('should return the result of checkIsSafeApp if connector is defined', async () => {
    mockUseAccountReturnValue.connector = true 
    mockUseQueryKeys.mockReturnValue({ isSafeApp: () => ['key'] })
    mockCheckIsSafeApp.mockResolvedValue(true)

    const { result, waitFor } = renderHook(() => useIsSafeApp())

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toBe(true)
    expect(mockUseQueryKeys).toHaveBeenCalled()
    expect(mockCheckIsSafeApp).toHaveBeenCalledWith(true)
  })
})