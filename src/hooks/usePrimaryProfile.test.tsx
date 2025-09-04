import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

import { usePrimaryProfile } from './usePrimaryProfile'
import { usePrimaryName } from './ensjs/public/usePrimaryName'
import { useRecords } from './ensjs/public/useRecords'

vi.mock('./ensjs/public/usePrimaryName')
vi.mock('./ensjs/public/useRecords')

const mockUsePrimaryName = vi.mocked(usePrimaryName)
const mockUseRecords = vi.mocked(useRecords)

describe('usePrimaryProfile', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children)

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

    renderHook(() => usePrimaryProfile({ address }), { wrapper })

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

    const { result } = renderHook(() => usePrimaryProfile({ address }), { wrapper })

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

    const { result } = renderHook(() => usePrimaryProfile({ address }), { wrapper })

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

    const { result } = renderHook(() => usePrimaryProfile({ address }), { wrapper })

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

    const { result } = renderHook(() => usePrimaryProfile({ address }), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isFetching).toBe(true)
  })
})