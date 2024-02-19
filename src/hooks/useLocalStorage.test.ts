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
})
