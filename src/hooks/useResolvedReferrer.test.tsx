import { renderHook, waitFor } from '@app/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { resolveReferrerToHex } from '@app/utils/referrer'

vi.mock('@app/utils/referrer', () => ({
  resolveReferrerToHex: vi.fn(),
}))

import { useResolvedReferrer } from './useResolvedReferrer'

describe('useResolvedReferrer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when no referrer provided', () => {
    const { result } = renderHook(() => useResolvedReferrer(undefined))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should resolve ENS name to hex', async () => {
    const mockHex = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Address
    vi.mocked(resolveReferrerToHex).mockResolvedValueOnce(mockHex)

    const { result } = renderHook(() => useResolvedReferrer('vitalik.eth'))

    await waitFor(() => {
      expect(result.current.data).toBe(mockHex)
      expect(result.current.isLoading).toBe(false)
    })

    expect(vi.mocked(resolveReferrerToHex)).toHaveBeenCalledWith(
      expect.anything(),
      'vitalik.eth'
    )
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(resolveReferrerToHex).mockRejectedValueOnce(new Error('Resolution failed'))

    const { result } = renderHook(() => useResolvedReferrer('invalid.eth'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isError).toBe(true)
    })
  })

  it('should handle null resolution result', async () => {
    vi.mocked(resolveReferrerToHex).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useResolvedReferrer('nonexistent.eth'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should return null when referrer is empty string', () => {
    const { result } = renderHook(() => useResolvedReferrer(''))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(vi.mocked(resolveReferrerToHex)).not.toHaveBeenCalled()
  })
})
