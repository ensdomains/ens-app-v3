import { describe, expect, it } from 'vitest'

import { getManagerRenewUrl, MANAGER_BASE_URL } from './getManagerRenewUrl'

describe('getManagerRenewUrl', () => {
  it('deep-links a single name to the Manager renew route as /renew/<name>', () => {
    // The Manager route is `/renew/$name`; the reversed `/<name>/renew` 404s.
    expect(getManagerRenewUrl(['nick.eth'])).toBe(`${MANAGER_BASE_URL}/renew/nick.eth`)
  })

  it('supports subnames and emoji/unicode labels in the path', () => {
    expect(getManagerRenewUrl(['sub.nick.eth'])).toBe(`${MANAGER_BASE_URL}/renew/sub.nick.eth`)
  })

  it('uses the provided base URL (e.g. mainnet)', () => {
    expect(getManagerRenewUrl(['nick.eth'], 'https://app.ens.domains')).toBe(
      'https://app.ens.domains/renew/nick.eth',
    )
    expect(getManagerRenewUrl(['nick.eth', 'alice.eth'], 'https://app.ens.domains')).toBe(
      'https://app.ens.domains',
    )
  })

  it('falls back to the Manager homepage for bulk renewals', () => {
    expect(getManagerRenewUrl(['nick.eth', 'alice.eth'])).toBe(MANAGER_BASE_URL)
  })

  it('falls back to the Manager homepage when there are no names', () => {
    expect(getManagerRenewUrl([])).toBe(MANAGER_BASE_URL)
  })
})
