import type { ComponentProps } from 'react'

import type { Select } from '@ensdomains/thorin'

// The canonical list of IANA time zones the runtime knows about. `supportedValuesOf`
// is ES2022; guard for older runtimes so the editor degrades to an empty picker
// rather than throwing at module load.
export const timezones: string[] = (() => {
  try {
    if (typeof Intl.supportedValuesOf === 'function') return Intl.supportedValuesOf('timeZone')
  } catch {
    // fall through to empty list
  }
  return []
})()

// A `Set` view of `timezones` for O(1) membership checks. Timezone validation
// (`isValidTimezone` / `validateTimezone`) tests against this same source, so the
// editor picker and validation can never disagree about what counts as canonical.
// Empty when the runtime lacks `Intl.supportedValuesOf`; callers treat that as
// "no allowlist available" and fall back to a best-effort check.
export const canonicalTimezones: ReadonlySet<string> = new Set(timezones)

// Options for the thorin `Select` autocomplete. The stored value is the canonical
// IANA zone; the label swaps underscores for spaces so it reads naturally and is
// still searchable by the zone name (e.g. "America/New York").
export const timezoneOptions = timezones.map((timezone) => ({
  value: timezone,
  label: timezone.replace(/_/g, ' '),
})) as ComponentProps<typeof Select>['options']

// Returns the picker options, prepending `value` as a synthetic option when it is
// not already a canonical zone — a record written before this feature, or a zone
// the runtime's Intl build does not enumerate — so the Select can display it and
// round-trip it instead of showing the value as unset.
export const timezoneOptionsWithValue = (
  value?: string,
): ComponentProps<typeof Select>['options'] =>
  value && !timezoneOptions?.some((option) => option.value === value)
    ? [{ value, label: value.replace(/_/g, ' ') }, ...(timezoneOptions ?? [])]
    : timezoneOptions
