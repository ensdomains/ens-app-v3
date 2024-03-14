import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { useValidate } from './useValidate'
import { mockUseValidateTypes, mockUseValidateConfig, makeMockUseValidate } from '../../test/mock/makeMockUseValidate'

describe('useValidate', () => {
  it('should return isNonASCII as false if all ascii', async () => {
    const { result } = renderHook(() => useValidate({ input: 'test' }))
    expect(result.current.isNonASCII).toEqual(false)
  })
  it('should return isNonASCII as true if contains non ascii', async () => {
    const { result } = renderHook(() => useValidate({ input: 'test❤️' }))
    expect(result.current.isNonASCII).toEqual(true)
  })
  it('should not error if % symbol is in input', async () => {
    const { result } = renderHook(() => useValidate({ input: '%' }))
    expect(result.current.isValid).toEqual(false)
  })

  describe('mocks', () => {
    it.each(mockUseValidateTypes)('should return expect value for %s ', (type) => {
      const config = mockUseValidateConfig[type]
      const { input } = config
      const { result } = renderHook(() => useValidate({ input }))
      const expected = makeMockUseValidate(type)
      expect(result.current).toEqual(expected)
    })
  })
})
