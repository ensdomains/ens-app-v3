import { renderHook, waitFor } from '@app/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { resolveReferrer } from '@app/utils/referrer'

vi.mock('@app/utils/referrer', () => ({
  resolveReferrer: vi.fn(),
}))

import { useResolvedReferrer } from './useResolvedReferrer'

describe('useResolvedReferrer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when no referrer provided', () => {
    const { result } = renderHook(() => useResolvedReferrer({ referrer: undefined }))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should resolve ENS name to hex', async () => {
    const mockHex = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Address
    vi.mocked(resolveReferrer).mockResolvedValueOnce(mockHex)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'vitalik.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBe(mockHex)
      expect(result.current.isLoading).toBe(false)
    })

    expect(vi.mocked(resolveReferrer)).toHaveBeenCalledWith(expect.anything(), 'vitalik.eth')
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(resolveReferrer).mockRejectedValueOnce(new Error('Resolution failed'))

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'invalid.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isError).toBe(true)
    })
  })

  it('should handle null resolution result', async () => {
    vi.mocked(resolveReferrer).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'nonexistent.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should return null when referrer is empty string', () => {
    const { result } = renderHook(() => useResolvedReferrer({ referrer: '' }))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(vi.mocked(resolveReferrer)).not.toHaveBeenCalled()
  })

  it('should resolve hex address to padded 32-byte hex', async () => {
    const hexAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    const paddedHex =
      '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Address
    vi.mocked(resolveReferrer).mockResolvedValueOnce(paddedHex)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: hexAddress }))

    await waitFor(() => {
      expect(result.current.data).toBe(paddedHex)
      expect(result.current.isLoading).toBe(false)
    })

    expect(vi.mocked(resolveReferrer)).toHaveBeenCalledWith(expect.anything(), hexAddress)
  })
})
