import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it("should return the default value if an item isn't found", () => {
    const { result } = renderHook(() => useLocalStorage('test123', 'default'))
    expect(result.current[0]).toEqual('default')
  })
  it('should return the value from local storage if found', () => {
    localStorage.setItem('test123', JSON.stringify('setValue'))
    const { result } = renderHook(() => useLocalStorage('test123', 'default'))
    expect(result.current[0]).toEqual('setValue')
  })
  it('should allow setting a bigint value', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('test123', 0n))
    result.current[1](1n)
    rerender()
    expect(result.current[0]).toEqual(1n)
    expect(localStorage.getItem('test123')).toMatchInlineSnapshot(
      `"{"__type":"bigint","value":"1"}"`,
    )
  })
  it('should allow retrieving a bigint value', () => {
    localStorage.setItem('test123', JSON.stringify({ __type: 'bigint', value: '1' }))
    const { result } = renderHook(() => useLocalStorage('test123', 0n))
    expect(result.current[0]).toEqual(1n)
  })
})
