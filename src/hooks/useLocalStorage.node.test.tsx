import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('should use the default value in SSR environments', () => {
    const { result } = renderHook(() => useLocalStorage('test123', 'default'))
    expect(result.current[0]).toEqual('default')
  })
})
