import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDefaultReverseRegistryName } from '@app/hooks/ensjs/public/useDefaultReverseRegistryName'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useReverseRegistryName } from '@app/hooks/ensjs/public/useReverseRegistryName'

import { usePrimaryNameFromSources } from './usePrimaryNameFromSources'

vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/ensjs/public/useReverseRegistryName')
vi.mock('@app/hooks/ensjs/public/useDefaultReverseRegistryName')

const mockUsePrimaryName = mockFunction(usePrimaryName)
const mockUseReverseRegistryName = mockFunction(useReverseRegistryName)
const mockUseDefaultReverseRegistryName = mockFunction(useDefaultReverseRegistryName)

const mockAddress = '0x1234567890123456789012345678901234567890' as const

describe('usePrimaryNameFromSources', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null values when usePrimaryName returns no name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data?.name).toBe(undefined)
    expect(result.current.data?.source).toBe(null)
    expect(result.current.data?.hasPrimaryName).toBe(false)
    expect(result.current.data?.hasDefaultPrimaryName).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  it('should return l1 source when usePrimaryName matches useReverseRegistryName', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'l1primary.eth', match: true, beautifiedName: 'l1primary.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: 'l1primary.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data?.name).toBe('l1primary.eth')
    expect(result.current.data?.source).toBe('l1')
    expect(result.current.data?.hasPrimaryName).toBe(true)
    expect(result.current.data?.hasDefaultPrimaryName).toBe(false)
  })

  it('should return default source when usePrimaryName matches useDefaultReverseRegistryName and no L1 match', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'defaultprimary.eth', match: true, beautifiedName: 'defaultprimary.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: 'defaultprimary.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data?.name).toBe('defaultprimary.eth')
    expect(result.current.data?.source).toBe('default')
    expect(result.current.data?.hasPrimaryName).toBe(false)
    expect(result.current.data?.hasDefaultPrimaryName).toBe(true)
  })

  it('should prioritize L1 over default when both match', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'shared.eth', match: true, beautifiedName: 'shared.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: 'shared.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: 'shared.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data?.name).toBe('shared.eth')
    expect(result.current.data?.source).toBe('l1')
    expect(result.current.data?.hasPrimaryName).toBe(true)
    expect(result.current.data?.hasDefaultPrimaryName).toBe(true)
  })

  it('should return null source when usePrimaryName returns a name but neither registry matches', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'unknown.eth', match: true, beautifiedName: 'unknown.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: 'different.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: 'other.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data?.name).toBe('unknown.eth')
    expect(result.current.data?.source).toBe(null)
    // hasPrimaryName is true because reverseRegistryName has data, even though it doesn't match
    expect(result.current.data?.hasPrimaryName).toBe(true)
    // hasDefaultPrimaryName is true because defaultReverseRegistryName has data, even though it doesn't match
    expect(result.current.data?.hasDefaultPrimaryName).toBe(true)
  })

  it('should disable source hooks when usePrimaryName returns no name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(mockUseReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(mockUseDefaultReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('should enable source hooks when usePrimaryName returns a name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'test.eth', match: true, beautifiedName: 'test.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: 'test.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(mockUseReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
    )
    expect(mockUseDefaultReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
    )
  })

  it('should show loading when usePrimaryName is loading', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: true,
      isSuccess: false,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.isLoading).toBe(true)
  })

  it('should show loading when usePrimaryName resolved but source hooks are loading', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'test.eth', match: true, beautifiedName: 'test.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: true,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.isLoading).toBe(true)
  })

  it('should be successful when usePrimaryName succeeds with no name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.isSuccess).toBe(true)
  })

  it('should be successful when primary name and at least one secondary query succeeds', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'test.eth', match: true, beautifiedName: 'test.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.isSuccess).toBe(true)
  })

  it('should not be successful when primary name has a name but no secondary queries succeed', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'test.eth', match: true, beautifiedName: 'test.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.isSuccess).toBe(false)
  })

  it('should return error from usePrimaryName', () => {
    const testError = new Error('Primary name query failed')
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: testError,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.error).toBe(testError)
  })

  it('should return error from source hooks when usePrimaryName has no error', () => {
    const testError = new Error('L1 query failed')
    mockUsePrimaryName.mockReturnValue({
      data: { name: 'test.eth', match: true, beautifiedName: 'test.eth' },
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: testError,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.error).toBe(testError)
  })

  it('should disable all hooks when enabled is false', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    renderHook(() => usePrimaryNameFromSources({ address: mockAddress, enabled: false }))

    expect(mockUsePrimaryName).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
    expect(mockUseReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(mockUseDefaultReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('should disable all hooks when address is undefined', () => {
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      error: null,
    })

    renderHook(() => usePrimaryNameFromSources({ address: undefined }))

    expect(mockUsePrimaryName).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
    expect(mockUseReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(mockUseDefaultReverseRegistryName).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('should expose primary name data with additional properties', () => {
    const mockPrimaryData = { name: 'test.eth', match: true, beautifiedName: 'test.eth' }
    mockUsePrimaryName.mockReturnValue({
      data: mockPrimaryData,
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseReverseRegistryName.mockReturnValue({
      data: 'test.eth',
      isLoading: false,
      isSuccess: true,
      error: null,
    })
    mockUseDefaultReverseRegistryName.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      error: null,
    })

    const { result } = renderHook(() => usePrimaryNameFromSources({ address: mockAddress }))

    expect(result.current.data).toEqual({
      ...mockPrimaryData,
      hasPrimaryName: true,
      hasDefaultPrimaryName: false,
      source: 'l1',
      reverseRegistryName: 'test.eth',
      defaultReverseRegistryName: null,
    })
  })
})
