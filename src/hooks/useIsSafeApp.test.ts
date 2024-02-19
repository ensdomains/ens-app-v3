import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { checkIsSafeApp } from '@app/utils/safe'

import { useIsSafeApp } from './useIsSafeApp'
import { useQueryKeyFactory } from './useQueryKeyFactory'

vi.mock('./useQueryKeyFactory')
vi.mock('@app/utils/safe')

const mockUseQueryKeyFactory = mockFunction(useQueryKeyFactory)
const mockCheckIsSafeApp = mockFunction(checkIsSafeApp)
const mockUseAccount = mockFunction(useAccount)

describe('useIsSafeApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not run if connector is not defined', async () => {
    mockUseQueryKeyFactory.mockReturnValue([{ id: undefined }])
    mockUseAccount.mockReturnValue({ connector: undefined })
    const { result } = renderHook(() => useIsSafeApp())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBe(undefined)
    expect(mockCheckIsSafeApp).not.toHaveBeenCalled()
  })

  it('should return the result of checkIsSafeApp if connector is defined', async () => {
    mockUseQueryKeyFactory.mockReturnValue([{ id: '1234' }])
    mockUseAccount.mockReturnValue({ connector: { id: '1234' } })
    mockCheckIsSafeApp.mockImplementation(async () => 'iframe')

    const { result } = renderHook(() => useIsSafeApp())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBe('iframe')
    expect(mockCheckIsSafeApp).toHaveBeenCalledWith(expect.objectContaining({ id: '1234' }))
  })
})
