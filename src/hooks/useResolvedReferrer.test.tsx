import { renderHook, waitFor } from '@app/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { getAddressRecord } from '@ensdomains/ensjs/public'

import { isValidEnsName } from '@app/utils/ensValidation'

import { useResolvedReferrer } from './useResolvedReferrer'

vi.mock('@ensdomains/ensjs/public', () => ({
  getAddressRecord: vi.fn(),
}))

vi.mock('@app/utils/ensValidation', () => ({
  isValidEnsName: vi.fn(),
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
    vi.mocked(isValidEnsName).mockReturnValue(true)
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
    vi.mocked(isValidEnsName).mockReturnValue(true)
    vi.mocked(getAddressRecord).mockRejectedValueOnce(new Error('Resolution failed'))

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'invalid.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.isError).toBe(true)
    })
  })

  it('should return error when ENS name has no address', async () => {
    vi.mocked(isValidEnsName).mockReturnValue(true)
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'nonexistent.eth' }))

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.isError).toBe(true)
      expect(result.current.error?.message).toBe(
        "ENS name 'nonexistent.eth' did not resolve to an address",
      )
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

  it('should return error when referrer is not a valid ENS name or hex', async () => {
    vi.mocked(isValidEnsName).mockReturnValue(false)

    const { result } = renderHook(() => useResolvedReferrer({ referrer: 'invalid-referrer' }))

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.isError).toBe(true)
      expect(result.current.error?.message).toBe("The referrer 'invalid-referrer' is not valid")
    })

    expect(vi.mocked(getAddressRecord)).not.toHaveBeenCalled()
  })
})
