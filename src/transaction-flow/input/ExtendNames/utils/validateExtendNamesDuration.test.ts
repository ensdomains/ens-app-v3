import { describe, expect, it } from 'vitest'

import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

import { validateExtendNamesDuration } from './validateExtendNamesDuration'

describe('validateExtendNamesDuration', () => {
  it('should return an integer', () => {
    expect(validateExtendNamesDuration({ duration: '90000' })).toBe(90000)
  })

  it('should return an integer for a decimal', () => {
    expect(validateExtendNamesDuration({ duration: '90000.123' })).toBe(90000)
  })

  it('should return minimum duration for a number less than the minimum', () => {
    expect(validateExtendNamesDuration({ duration: '0' })).toBe(ONE_DAY)
  })

  it('should return null duration for null', () => {
    expect(validateExtendNamesDuration({ duration: null })).toBe(null)
  })

  it('should return default duration for undefined', () => {
    expect(validateExtendNamesDuration({ duration: undefined })).toBe(ONE_YEAR)
  })

  it('should return default for a string', () => {
    expect(validateExtendNamesDuration({ duration: 'abc' })).toBe(ONE_YEAR)
  })

  it('should return default for an empty string', () => {
    expect(validateExtendNamesDuration({ duration: '' })).toBe(ONE_YEAR)
  })

  it('should return default for a negative number', () => {
    expect(validateExtendNamesDuration({ duration: '-123' })).toBe(ONE_YEAR)
  })

  it('should return default for an object ', () => {
    expect(validateExtendNamesDuration({ duration: {} })).toBe(ONE_YEAR)
  })
})
