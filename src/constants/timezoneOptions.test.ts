import { describe, expect, it } from 'vitest'

import enRegister from '../../public/locales/en/register.json'
import { timezoneOptions, timezones } from './timezoneOptions'

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

describe('timezone i18n (general group)', () => {
  it('exposes a Timezone label and a searchable placeholder (acceptance criterion 1)', () => {
    const general = enRegister.steps.profile.options.groups.general
    expect(general.items.timezone).toBe('Timezone')
    expect(general.placeholder.timezone).toBe('Search for a timezone')
  })
})
