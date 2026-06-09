import { describe, expect, it } from 'vitest'

import { parseSimplexUrls } from './parseSimplexUrls'

// Round-trip rule must stay identical to scripts/resolver/snrc-resolve.py's
// `split_csv`. Mirrors the cases in test_snrc_resolve.py — change them in
// lockstep.
describe('parseSimplexUrls', () => {
  it('returns an empty list for empty / undefined / whitespace input', () => {
    expect(parseSimplexUrls('')).toEqual([])
    expect(parseSimplexUrls(undefined)).toEqual([])
    expect(parseSimplexUrls('   ')).toEqual([])
    expect(parseSimplexUrls(' , , ')).toEqual([])
  })

  it('returns a one-element list for a single URL', () => {
    expect(parseSimplexUrls('https://smp16.simplex.im/a#H1')).toEqual([
      'https://smp16.simplex.im/a#H1',
    ])
  })

  it('splits a comma-separated value into an ordered list', () => {
    expect(
      parseSimplexUrls('https://smp16.simplex.im/a#H1,https://smp19.simplex.im/a#H1'),
    ).toEqual(['https://smp16.simplex.im/a#H1', 'https://smp19.simplex.im/a#H1'])
  })

  it('trims whitespace around each comma-separated entry', () => {
    expect(
      parseSimplexUrls(
        '  https://smp16.simplex.im/a#H1 ,\thttps://smp19.simplex.im/a#H1 ',
      ),
    ).toEqual(['https://smp16.simplex.im/a#H1', 'https://smp19.simplex.im/a#H1'])
  })

  it('drops empty entries from doubled or trailing commas', () => {
    expect(parseSimplexUrls('https://smp16.simplex.im/a#H1,')).toEqual([
      'https://smp16.simplex.im/a#H1',
    ])
    expect(
      parseSimplexUrls('https://smp16.simplex.im/a#H1,,https://smp19.simplex.im/a#H1'),
    ).toEqual(['https://smp16.simplex.im/a#H1', 'https://smp19.simplex.im/a#H1'])
  })

  it('preserves the order of the input', () => {
    expect(parseSimplexUrls('c,a,b')).toEqual(['c', 'a', 'b'])
  })
})
