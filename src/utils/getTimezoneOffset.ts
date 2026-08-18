// Utilities for rendering a profile's `timezone` text record as a viewer-relative
// offset (e.g. `Europe/London (+02:00)`). Uses native `Intl` only — no date deps.

import { canonicalTimezones } from '@app/constants/timezoneOptions'

type GetTimezoneOffsetOptions = {
  /** The instant at which to compute the offset. Defaults to now. */
  now?: Date
  /** The IANA zone of the viewer. Defaults to the runtime's resolved zone. */
  viewerTimeZone?: string
}

/**
 * The ICU-canonical zone `Intl` resolves `timeZone` to, or `null` if the runtime
 * rejects it. Doubles as the "does `Intl` accept this at all" check.
 */
const resolveTimeZone = (timeZone: string): string | null => {
  try {
    // Throws RangeError for time zones the runtime does not recognise.
    return new Intl.DateTimeFormat(undefined, { timeZone }).resolvedOptions().timeZone
  } catch {
    return null
  }
}

// The area (segment before the first `/`) of an IANA identifier, or '' when it
// has no area — e.g. an abbreviation like `PST`.
const timeZoneArea = (timeZone: string): string => {
  const slash = timeZone.indexOf('/')
  return slash === -1 ? '' : timeZone.slice(0, slash)
}

/**
 * Whether `timeZone` is a canonical IANA zone — one the editor's picker could have
 * produced. Checked for membership in the same `Intl.supportedValuesOf('timeZone')`
 * allowlist the picker is built from, NOT "does `Intl` accept it": V8's ICU
 * resolves legacy abbreviation/offset/compat aliases (`PST`, `EST`, `GMT+5`,
 * `US/Pacific`) without throwing, and this feature is canonical-only.
 *
 * Two allowances keep genuine canonical zones valid across ICU builds, which
 * disagree at the edges: a build may enumerate a zone under an older spelling
 * (`Asia/Calcutta` for `Asia/Kolkata`) or omit `UTC` from the list. So a zone that
 * resolves into the allowlist within the same area, and `UTC` itself, are accepted
 * too. When the runtime lacks `Intl.supportedValuesOf` there is no allowlist, so we
 * fall back to the best-effort "does `Intl` accept it" check rather than reject
 * every zone.
 */
export const isValidTimezone = (timeZone?: string): timeZone is string => {
  if (!timeZone || typeof timeZone !== 'string') return false
  // No allowlist (runtime without `Intl.supportedValuesOf`): stay best-effort.
  if (canonicalTimezones.size === 0) return resolveTimeZone(timeZone) !== null
  // Canonical fast path — guarantees every value the picker offers validates.
  if (canonicalTimezones.has(timeZone)) return true
  const resolved = resolveTimeZone(timeZone)
  if (resolved === null) return false
  // `UTC` is canonical but missing from some ICU allowlists, and is the viewer's
  // own zone on UTC servers, which must stay valid.
  if (resolved === 'UTC') return true
  // Otherwise accept only a same-area rename of an allowlisted zone (spelling
  // drift like `Kolkata`↔`Calcutta`); reject aliases whose resolution jumps area
  // (`US/Pacific` → `America/…`) or that have no area at all (`PST`, `EST`).
  const area = timeZoneArea(timeZone)
  return area !== '' && area === timeZoneArea(resolved) && canonicalTimezones.has(resolved)
}

const getViewerTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * The UTC offset of an IANA `timeZone` at a given instant, in minutes, DST-aware.
 * Derived by formatting the instant as wall-clock time in the target zone and
 * comparing it against the real UTC time.
 */
const getZoneOffsetMinutes = (timeZone: string, date: Date): number => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = formatter.formatToParts(date)
  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  const asUtc = Date.UTC(
    lookup('year'),
    lookup('month') - 1,
    lookup('day'),
    lookup('hour'),
    lookup('minute'),
    lookup('second'),
  )
  return Math.round((asUtc - date.getTime()) / 60_000)
}

const formatOffset = (totalMinutes: number): string => {
  const sign = totalMinutes < 0 ? '-' : '+'
  const absMinutes = Math.abs(totalMinutes)
  const hours = Math.floor(absMinutes / 60)
  const minutes = absMinutes % 60
  const pad = (value: number) => value.toString().padStart(2, '0')
  return `${sign}${pad(hours)}:${pad(minutes)}`
}

/**
 * Returns how far ahead (`+`) or behind (`-`) the profile's `timeZone` is from the
 * viewer's zone, formatted as `±HH:MM`. Returns `null` for an unset or invalid
 * zone so the caller renders nothing.
 */
export const getTimezoneOffset = (
  timeZone?: string,
  options: GetTimezoneOffsetOptions = {},
): string | null => {
  if (!isValidTimezone(timeZone)) return null
  const now = options.now ?? new Date()
  const viewerTimeZone = options.viewerTimeZone ?? getViewerTimeZone()
  try {
    const targetOffset = getZoneOffsetMinutes(timeZone, now)
    const viewerOffset = isValidTimezone(viewerTimeZone)
      ? getZoneOffsetMinutes(viewerTimeZone, now)
      : -now.getTimezoneOffset()
    return formatOffset(targetOffset - viewerOffset)
  } catch {
    return null
  }
}
