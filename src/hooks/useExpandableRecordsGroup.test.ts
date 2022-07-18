import { renderHook, act } from '@app/test-utils'
import useExpandableRecordsGroup from './useExpandableRecordsGroup'

const mockGetValues = jest.fn()
const mockSetValue = jest.fn()

describe('useExpandableRecordsGroup', () => {
  afterEach(() => {
    jest.resetAllMocks()
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
      result.current.addKey()
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

  it('should add key with prefix when addKey is called with no available options', async () => {
    const options = [{ value: 'test', label: 'test' }]
    const existingKeys: string[] = [
      'test',
      'prefix1',
      'prefix2',
      'prefix21',
      'prefixNan',
    ]
    mockGetValues.mockReturnValue({
      test: '',
      prefix1: '',
      prefix2: '',
      prefix21: '',
      prefixNan: '',
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
      result.current.addKey('prefix')
    })
    expect(result.current.newKeys).toEqual(['prefix22'])
    expect(mockSetValue.mock.calls[0][1]).toEqual({
      test: '',
      prefix1: '',
      prefix2: '',
      prefix21: '',
      prefixNan: '',
      prefix22: '',
    })
  })

  it('should replace existing key with new key when changeKey is called', async () => {
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
      result.current.changeKey('test', 'test2')
    })
    expect(result.current.existingKeys).toEqual([])
    expect(result.current.newKeys).toEqual(['test2'])
    expect(mockSetValue.mock.calls[0][1]).toEqual({
      test2: 'test',
    })
  })

  it('should replace old key in newKeys with new key when changeKey is called', async () => {
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
      result.current.addKey()
    })
    mockGetValues.mockReturnValue({
      test: '',
    })
    act(() => {
      result.current.changeKey('test', 'test2')
    })
    expect(result.current.newKeys).toEqual(['test2'])
    expect(mockSetValue.mock.calls[1][1]).toEqual({
      test2: '',
    })
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
      result.current.addKey()
    })
    expect(result.current.newKeys).toEqual(['test'])
    mockGetValues.mockReturnValue({
      test: '',
    })
    act(() => {
      result.current.removeKey('test')
    })
    expect(result.current.newKeys).toEqual([])
    expect(mockSetValue.mock.calls[1][1]).toEqual({})
  })
})
