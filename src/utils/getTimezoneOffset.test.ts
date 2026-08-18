import { describe, expect, it } from 'vitest'

import { getTimezoneOffset, isValidTimezone } from './getTimezoneOffset'

// Pin both the instant and the viewer zone so results are deterministic and
// independent of where/when the test runs. Asia/Kolkata (+05:30) and other
// fixtures below are DST-free, so a fixed `now` is sufficient.
const NOW = new Date('2024-01-15T12:00:00Z')

const offset = (timeZone: string, viewerTimeZone: string) =>
  getTimezoneOffset(timeZone, { now: NOW, viewerTimeZone })

describe('isValidTimezone', () => {
  it('accepts canonical IANA zones', () => {
    expect(isValidTimezone('Europe/London')).toBe(true)
    expect(isValidTimezone('Asia/Tokyo')).toBe(true)
    expect(isValidTimezone('America/New_York')).toBe(true)
  })

  it('rejects empty and unknown zones', () => {
    expect(isValidTimezone(undefined)).toBe(false)
    expect(isValidTimezone('')).toBe(false)
    expect(isValidTimezone('Not/AZone')).toBe(false)
    expect(isValidTimezone('Mars/Olympus_Mons')).toBe(false)
  })

  // V8's ICU resolves these legacy aliases without throwing, so a "does Intl
  // accept it" check wrongly accepted them. Validation is canonical-only.
  it('rejects legacy aliases that Intl resolves without throwing', () => {
    expect(isValidTimezone('PST')).toBe(false)
    expect(isValidTimezone('EST')).toBe(false)
    expect(isValidTimezone('GMT+5')).toBe(false)
    expect(isValidTimezone('US/Pacific')).toBe(false)
  })

  it('accepts canonical zones the runtime may spell differently or omit', () => {
    // ICU may enumerate these under an older spelling (Asia/Calcutta) or omit UTC
    // from the allowlist, but they are genuine canonical zones and must validate.
    expect(isValidTimezone('Asia/Kolkata')).toBe(true)
    expect(isValidTimezone('Asia/Kathmandu')).toBe(true)
    expect(isValidTimezone('UTC')).toBe(true)
  })
})

describe('getTimezoneOffset', () => {
  it('returns +00:00 when the profile shares the viewer zone', () => {
    expect(offset('Asia/Tokyo', 'Asia/Tokyo')).toBe('+00:00')
  })

  it('returns a positive offset when the profile is ahead of the viewer', () => {
    // Tokyo (+09:00) is 3.5h ahead of Kolkata (+05:30)
    expect(offset('Asia/Tokyo', 'Asia/Kolkata')).toBe('+03:30')
  })

  it('returns a negative offset when the profile is behind the viewer', () => {
    // Kolkata (+05:30) is 3.5h behind Tokyo (+09:00)
    expect(offset('Asia/Kolkata', 'Asia/Tokyo')).toBe('-03:30')
  })

  it('handles quarter-hour zones', () => {
    // Kathmandu (+05:45) vs UTC viewer
    expect(offset('Asia/Kathmandu', 'UTC')).toBe('+05:45')
    // Eucla (+08:45) vs Kolkata (+05:30) = +03:15
    expect(offset('Australia/Eucla', 'Asia/Kolkata')).toBe('+03:15')
  })

  it('is DST-aware (computes the offset at the given instant)', () => {
    // London is on GMT (UTC+0) in January and BST (UTC+1) in July.
    const january = getTimezoneOffset('Europe/London', {
      now: new Date('2024-01-15T12:00:00Z'),
      viewerTimeZone: 'UTC',
    })
    const july = getTimezoneOffset('Europe/London', {
      now: new Date('2024-07-15T12:00:00Z'),
      viewerTimeZone: 'UTC',
    })
    expect(january).toBe('+00:00')
    expect(july).toBe('+01:00')
  })

  it('is DST-aware on the viewer side (the offset shifts when the viewer enters DST)', () => {
    // Target Asia/Tokyo is +09:00 year-round; viewer Europe/London is GMT in
    // January and BST (+01:00) in July, so the relative offset drops by an hour.
    const january = getTimezoneOffset('Asia/Tokyo', {
      now: new Date('2024-01-15T12:00:00Z'),
      viewerTimeZone: 'Europe/London',
    })
    const july = getTimezoneOffset('Asia/Tokyo', {
      now: new Date('2024-07-15T12:00:00Z'),
      viewerTimeZone: 'Europe/London',
    })
    expect(january).toBe('+09:00')
    expect(july).toBe('+08:00')
  })

  it('returns null for unset or invalid zones', () => {
    expect(getTimezoneOffset(undefined, { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
    expect(getTimezoneOffset('', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
    expect(getTimezoneOffset('Not/AZone', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
  })

  // An informal `PST` (and other legacy aliases) must render nothing — i.e. a null
  // offset, so the header shows nothing rather than `PST (-08:00)`.
  it('returns null for legacy aliases so the header renders nothing', () => {
    expect(getTimezoneOffset('PST', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
    expect(getTimezoneOffset('EST', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
    expect(getTimezoneOffset('GMT+5', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
    expect(getTimezoneOffset('US/Pacific', { now: NOW, viewerTimeZone: 'UTC' })).toBeNull()
  })
})
