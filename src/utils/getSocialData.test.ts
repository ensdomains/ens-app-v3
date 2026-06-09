import { describe, expect, it } from 'vitest'

import { getSocialData } from './getSocialData'

describe('getSocialData', () => {
  // Regression: `simplex.contact` / `simplex.channel` may hold a
  // comma-separated list of SMP-server URLs for redundancy. The renderer
  // (`SocialProfileButton`) gates on `urls.length > 1` to decide between
  // a plain `<a>` and a `Dropdown` of clickable items, so the contract
  // here is: `urls` is the parsed list (primary first), `urlFormatter`
  // is its first element for the single-link fallback path.
  it('parses simplex.contact CSV into urls (primary first) and exposes the first URL via urlFormatter', () => {
    const result = getSocialData(
      'simplex.contact',
      'https://smp16.simplex.im/a#H1,https://smp19.simplex.im/a#H1',
    )
    expect(result).toMatchObject({
      icon: 'simplex.contact',
      type: 'link',
      urls: ['https://smp16.simplex.im/a#H1', 'https://smp19.simplex.im/a#H1'],
      urlFormatter: 'https://smp16.simplex.im/a#H1',
    })
  })

  it('treats a single-URL simplex.contact value as a 1-element list', () => {
    const result = getSocialData('simplex.contact', 'https://smp16.simplex.im/a#H1')
    expect(result).toMatchObject({
      urls: ['https://smp16.simplex.im/a#H1'],
      urlFormatter: 'https://smp16.simplex.im/a#H1',
    })
  })

  it('returns an empty url list for an empty simplex.channel value', () => {
    const result = getSocialData('simplex.channel', '')
    expect(result).toMatchObject({
      icon: 'simplex.channel',
      urls: [],
    })
  })

  it('does not parse non-simplex entries into a url list', () => {
    const result = getSocialData('com.github', 'octocat')
    expect(result).toMatchObject({ icon: 'com.github', value: 'octocat' })
    expect(result).not.toHaveProperty('urls')
  })

  it('returns null for unsupported keys', () => {
    expect(getSocialData('not.a.real.key', 'whatever')).toBeNull()
  })
})
