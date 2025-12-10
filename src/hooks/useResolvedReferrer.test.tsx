import { renderHook, waitFor } from '@app/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { getAddressRecord } from '@ensdomains/ensjs/public'
import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { useResolvedReferrer } from './useResolvedReferrer'

vi.mock('@ensdomains/ensjs/public', () => ({
  getAddressRecord: vi.fn(),
}))

describe('useResolvedReferrer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return undefined when no referrer provided', () => {
    const { result } = renderHook(() => useResolvedReferrer({ referrer: undefined }))

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should resolve ENS name to hex', async () => {
    const mockAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address
    vi.mocked(getAddressRecord).mockResolvedValueOnce({
      value: mockAddress,
      coin: 60,
    } as any)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'vitalik.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
      expect(result.current.data?.length).toBe(66)
      expect(result.current.isLoading).toBe(false)
    })

    expect(vi.mocked(getAddressRecord)).toHaveBeenCalled()
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(getAddressRecord).mockRejectedValueOnce(new Error('Resolution failed'))

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'invalid.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.isError).toBe(true)
    })
  })

  it('should return EMPTY_BYTES32 when name has no address', async () => {
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'nonexistent.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBe(EMPTY_BYTES32)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should return undefined when referrer is empty string', () => {
    const { result } = renderHook(() => useResolvedReferrer({ referrer: '' }))

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(vi.mocked(getAddressRecord)).not.toHaveBeenCalled()
  })

  it('should resolve hex address without calling getAddressRecord', async () => {
    const hexAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

    const { result } = renderHook(() => useResolvedReferrer({ referrer: hexAddress }))

    await waitFor(() => {
      expect(result.current.data?.length).toBe(66)
      expect(result.current.isLoading).toBe(false)
    })

    // Should not call getAddressRecord for hex addresses
    expect(vi.mocked(getAddressRecord)).not.toHaveBeenCalled()
  })
})
