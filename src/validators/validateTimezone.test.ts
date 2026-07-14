import { describe, expect, it } from 'vitest'

import { validateTimezone } from './validateTimezone'

describe('validateTimezone', () => {
  it('treats an empty value as valid (clearing the record)', () => {
    expect(validateTimezone()).toBe(true)
    expect(validateTimezone('')).toBe(true)
  })

  it('accepts canonical IANA zones', () => {
    expect(validateTimezone('Europe/London')).toBe(true)
    expect(validateTimezone('Asia/Kathmandu')).toBe(true)
    expect(validateTimezone('America/New_York')).toBe(true)
  })

  it('rejects unknown zones', () => {
    expect(validateTimezone('Not/AZone')).toBe(false)
    expect(validateTimezone('Europe')).toBe(false)
    expect(validateTimezone('12345')).toBe(false)
  })

  // These legacy aliases resolve without throwing, so a parse-based check accepted
  // them on the free-text / programmatic path. Validation is canonical-only.
  it('rejects legacy aliases that resolve without throwing', () => {
    expect(validateTimezone('PST')).toBe(false)
    expect(validateTimezone('EST')).toBe(false)
    expect(validateTimezone('GMT+5')).toBe(false)
    expect(validateTimezone('US/Pacific')).toBe(false)
  })
})
