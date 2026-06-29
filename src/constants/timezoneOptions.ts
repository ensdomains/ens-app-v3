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

// Options for the thorin `Select` autocomplete. The stored value is the canonical
// IANA zone; the label swaps underscores for spaces so it reads naturally and is
// still searchable by the zone name (e.g. "America/New York").
export const timezoneOptions = timezones.map((timezone) => ({
  value: timezone,
  label: timezone.replace(/_/g, ' '),
})) as ComponentProps<typeof Select>['options']
