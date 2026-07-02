// Utilities for rendering a profile's `timezone` text record as a viewer-relative
// offset (e.g. `Europe/London (+02:00)`). Uses native `Intl` only — no date deps.

type GetTimezoneOffsetOptions = {
  /** The instant at which to compute the offset. Defaults to now. */
  now?: Date
  /** The IANA zone of the viewer. Defaults to the runtime's resolved zone. */
  viewerTimeZone?: string
}

/**
 * Whether `timeZone` is a time zone that `Intl` can resolve. Unknown zones make
 * the `Intl.DateTimeFormat` constructor throw a `RangeError`; we treat anything
 * that throws as invalid so callers can render nothing rather than crash.
 */
export const isValidTimezone = (timeZone?: string): timeZone is string => {
  if (!timeZone || typeof timeZone !== 'string') return false
  try {
    // Throws RangeError for unknown time zones.
    Intl.DateTimeFormat(undefined, { timeZone })
    return true
  } catch {
    return false
  }
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
