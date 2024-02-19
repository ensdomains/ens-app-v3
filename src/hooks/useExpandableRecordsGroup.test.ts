import { act, renderHook } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import useExpandableRecordsGroup from './useExpandableRecordsGroup'

const mockGetValues = vi.fn()
const mockSetValue = vi.fn()

describe('useExpandableRecordsGroup', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should add unused option to newKeys when addKey is called', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = []
    mockGetValues.mockReturnValue({})
    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )
    act(() => {
      result.current.addKey('test')
    })
    expect(result.current.newKeys).toEqual(['test'])
    expect(mockSetValue.mock.calls[0][1]).toEqual({ test: '' })
  })

  it('should set hasOptions to false if there are no available options', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = ['test']
    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )
    const { hasOptions } = result.current
    expect(hasOptions).toBe(false)
  })

  it('should return available options', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = []

    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )
    expect(result.current.availableOptions).toEqual(options)
  })

  it('should return selected option', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = []

    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )

    expect(result.current.getSelectedOption('test')).toEqual(options[0])
  })

  it('should remove key from existingKeys when removeKey is called', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = ['test']
    mockGetValues.mockReturnValue({
      test: 'test',
    })
    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )
    act(() => {
      result.current.removeKey('test')
    })

    expect(result.current.existingKeys).toEqual([])
    expect(mockSetValue.mock.calls[0][1]).toEqual({})
  })

  it('should remove key from newKeys when removeKey is called', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = []
    mockGetValues.mockReturnValue({})
    const { result } = renderHook(() =>
      useExpandableRecordsGroup({
        group: 'test',
        options,
        existingKeys,
        getValues: mockGetValues,
        setValue: mockSetValue,
      }),
    )
    act(() => {
      result.current.addKey('test')
    })
    expect(result.current.newKeys).toEqual(['test'])
    mockGetValues.mockReturnValue({
      test: '',
    })
    act(() => {
      result.current.removeKey('test')
    })
    expect(result.current.newKeys).toEqual([])
  })
})
