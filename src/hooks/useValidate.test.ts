import { renderHook } from '@app/test-utils'

import { useValidate } from './useValidate'

describe('useValidate', () => {
  it('should return isNonASCII as false if all ascii', async () => {
    const { result } = renderHook(() => useValidate('test'))
    expect(result.current.isNonASCII).toEqual(false)
  })
  it('should return isNonASCII as true if contains non ascii', async () => {
    const { result } = renderHook(() => useValidate('test❤️'))
    expect(result.current.isNonASCII).toEqual(true)
  })
  it('should not error if % symbol is in input', async () => {
    const { result } = renderHook(() => useValidate('%'))
    expect(result.current.isValid).toEqual(false)
  })
})
