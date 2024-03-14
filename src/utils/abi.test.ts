import { describe, expect, it } from 'vitest'

import { abiDisplayValue } from './abi'

describe('abiDisplayValue', () => {
  it.each([
    [1, { test: 'test' }, '{"test":"test"}'],
    [1, 'string', ''],
    [1, undefined, ''],
    [2, { test: 'test' }, '{"test":"test"}'],
    [2, 'string', ''],
    [2, undefined, ''],
    [4, { test: 'test' }, '{"test":"test"}'],
    [4, 'string', ''],
    [4, undefined, ''],
    [8, { test: 'test' }, ''],
    [8, undefined, ''],
    [8, 'string', 'string'],
    [16, { test: 'test' }, ''],
    [16, undefined, ''],
    [16, 'string', ''],
  ])(
    'should return correct value for contentType %i and abi of %p (%p)',
    (contentType, abi, expected) => {
      const result = abiDisplayValue({ contentType, abi: abi as any, decoded: true })
      expect(result).toEqual(expected)
    },
  )
})
