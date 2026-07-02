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
})
