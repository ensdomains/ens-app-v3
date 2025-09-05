import { renderHook, waitFor } from '@app/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { usePrimaryProfile } from './usePrimaryProfile'
import { usePrimaryName } from './ensjs/public/usePrimaryName'
import { useRecords } from './ensjs/public/useRecords'

vi.mock('./ensjs/public/usePrimaryName')
vi.mock('./ensjs/public/useRecords')

const mockUsePrimaryName = vi.mocked(usePrimaryName)
const mockUseRecords = vi.mocked(useRecords)

describe('usePrimaryProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pass allowMismatch: true to usePrimaryName', () => {
    const address = '0x1234567890abcdef' as any
    
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    } as any)
    
    mockUseRecords.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    } as any)

    renderHook(() => usePrimaryProfile({ address }))

    expect(mockUsePrimaryName).toHaveBeenCalledWith({
      address,
      enabled: true,
      allowMismatch: true,
    })
  })

  it('should return primary name data with match and originalName fields', async () => {
    const address = '0x1234567890abcdef' as any
    const primaryData = {
      name: 'metamask.eth',
      originalName: 'MetaMask.eth',
      match: false,
      beautifiedName: 'MetaMask.eth',
    }
    
    const recordsData = {
      texts: [
        { key: 'description', value: 'Test description' },
        { key: 'url', value: 'https://test.com' },
      ],
      coins: [],
    }

    mockUsePrimaryName.mockReturnValue({
      data: primaryData,
      isLoading: false,
      isFetching: false,
    } as any)
    
    mockUseRecords.mockReturnValue({
      data: recordsData,
      isLoading: false,
      isFetching: false,
    } as any)

    const { result } = renderHook(() => usePrimaryProfile({ address }))

    await waitFor(() => {
      expect(result.current.data).toEqual({
        name: primaryData.name,
        match: primaryData.match,
        originalName: primaryData.originalName,
        ...recordsData,
      })
    })
  })

  it('should handle mismatched names correctly', async () => {
    const address = '0x43e47385f6b3f8bdbe02c210bf5c74b6c34ff441' as any
    const primaryData = {
      name: 'metamask.eth',
      originalName: 'MetaMask.eth',
      match: false,
      beautifiedName: 'MetaMask.eth',
    }
    
    mockUsePrimaryName.mockReturnValue({
      data: primaryData,
      isLoading: false,
      isFetching: false,
    } as any)
    
    mockUseRecords.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    } as any)

    const { result } = renderHook(() => usePrimaryProfile({ address }))

    await waitFor(() => {
      expect(result.current.data).toEqual({
        name: 'metamask.eth',
        match: false,
        originalName: 'MetaMask.eth',
      })
    })
  })

  it('should return undefined when no primary name exists', async () => {
    const address = '0x1234567890abcdef' as any
    
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    } as any)
    
    mockUseRecords.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    } as any)

    const { result } = renderHook(() => usePrimaryProfile({ address }))

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
    })
  })

  it('should handle loading states correctly', () => {
    const address = '0x1234567890abcdef' as any
    
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
    } as any)
    
    mockUseRecords.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
    } as any)

    const { result } = renderHook(() => usePrimaryProfile({ address }))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isFetching).toBe(true)
  })
})