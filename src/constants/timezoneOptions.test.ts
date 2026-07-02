import { describe, expect, it } from 'vitest'

import enRegister from '../../public/locales/en/register.json'
import { timezoneOptions, timezoneOptionsWithValue, timezones } from './timezoneOptions'

describe('timezoneOptions', () => {
  it('derives one option per runtime IANA zone', () => {
    expect(timezones.length).toBeGreaterThan(0)
    expect(timezoneOptions?.length).toBe(timezones.length)
  })

  it('keeps the canonical IANA value but renders a readable label for multi-word zones', () => {
    const newYork = timezoneOptions?.find((option) => option.value === 'America/New_York')
    expect(newYork).toBeDefined()
    // Value stays canonical (round-trips to the resolver); label is human-readable.
    expect(newYork?.value).toBe('America/New_York')
    expect(newYork?.label).toBe('America/New York')
  })
})

describe('timezoneOptionsWithValue', () => {
  it('returns the canonical options unchanged for a listed zone', () => {
    expect(timezoneOptionsWithValue('America/New_York')).toBe(timezoneOptions)
  })

  it('returns the canonical options unchanged for an empty value', () => {
    expect(timezoneOptionsWithValue('')).toBe(timezoneOptions)
    expect(timezoneOptionsWithValue(undefined)).toBe(timezoneOptions)
  })

  it('prepends a synthetic option for a value not in the canonical list', () => {
    const options = timezoneOptionsWithValue('Legacy/Zone_Name')
    expect(options?.[0]).toEqual({ value: 'Legacy/Zone_Name', label: 'Legacy/Zone Name' })
    expect(options?.length).toBe((timezoneOptions?.length ?? 0) + 1)
  })
})

describe('timezone i18n (general group)', () => {
  it('exposes a Timezone label and a searchable placeholder (acceptance criterion 1)', () => {
    const general = enRegister.steps.profile.options.groups.general
    expect(general.items.timezone).toBe('Timezone')
    expect(general.placeholder.timezone).toBe('Search for a timezone')
  })
})
