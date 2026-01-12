import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import {
  makeMockUseValidate,
  mockUseValidateConfig,
  mockUseValidateTypes,
} from '../../test/mock/makeMockUseValidate'
import { useValidate } from './useValidate'

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
  it('should normalize decomposed to composed (NFC) identically', () => {
    const composed = 'café' // e.g., "é" as single code point
    const decomposed = 'cafe\u0301' // "e" + combining acute
    const a = renderHook(() => useValidate({ input: composed }))
    const b = renderHook(() => useValidate({ input: decomposed }))
    expect(a.result.current.name).toEqual(b.result.current.name)
    expect(a.result.current.beautifiedName).toEqual(b.result.current.beautifiedName)
  })
  it('should detect mixed scripts when combining Latin and Cyrillic', () => {
    const { result } = renderHook(() => useValidate({ input: 'pаypal' })) // second "a" is Cyrillic
    expect(result.current.isNonASCII).toEqual(true)
    expect(result.current.hasMixedScripts).toEqual(true)
    expect(result.current.isLatinOnly).toEqual(false)
  })
  it('should treat Latin with diacritics as info (nonASCII but LatinOnly)', () => {
    const { result } = renderHook(() => useValidate({ input: 'jalapeño' }))
    expect(result.current.isNonASCII).toEqual(true)
    expect(result.current.isLatinOnly).toEqual(true)
    expect(result.current.hasMixedScripts).toEqual(false)
  })
  it('should detect emoji including ZWJ sequences', () => {
    const familyZWJ = '👨‍👩‍👧‍👦' // ZWJ sequence
    const { result } = renderHook(() => useValidate({ input: `test${familyZWJ}` }))
    expect(result.current.hasEmoji).toEqual(true)
  })
  it('should treat Spanish words with diacritics as LatinOnly info (not mixed)', () => {
    const words = ['españa', 'camión', 'pingüino']
    for (const w of words) {
      const { result } = renderHook(() => useValidate({ input: w }))
      expect(result.current.isNonASCII).toEqual(true)
      expect(result.current.isLatinOnly).toEqual(true)
      expect(result.current.hasMixedScripts).toEqual(false)
    }
  })
  it('should cache the result for the same input', () => {
    const { result, rerender } = renderHook(({ input }) => useValidate({ input }), {
      initialProps: { input: 'test' },
    })
    const firstResult = result.current
    rerender({ input: 'test' })
    const secondResult = result.current
    expect(firstResult).toBe(secondResult)
  })
  it('should process different inputs independently', () => {
    const { result, rerender } = renderHook(({ input }) => useValidate({ input }), {
      initialProps: { input: 'test' },
    })
    const firstResult = result.current
    rerender({ input: 'anotherTest' })
    const secondResult = result.current
    expect(firstResult).not.toBe(secondResult)
  })
  it('should return defaultData for empty input', () => {
    const { result } = renderHook(() => useValidate({ input: '' }))
    expect(result.current).toEqual({
      name: '',
      beautifiedName: '',
      isNonASCII: undefined,
      labelCount: 0,
      type: undefined,
      isValid: undefined,
      isShort: undefined,
      is2LD: undefined,
      isETH: undefined,
      labelDataArray: [],
      hasEmoji: undefined,
      hasMixedScripts: undefined,
      isLatinOnly: undefined,
    })
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
