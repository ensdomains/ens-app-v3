import { describe, expect, it } from 'vitest'

import { getManagerBaseUrl } from './getManagerBaseUrl'

describe('getManagerBaseUrl', () => {
  it('returns app.ens.domains on mainnet', () => {
    expect(getManagerBaseUrl('mainnet')).toBe('https://app.ens.domains')
  })

  it.each(['sepolia', 'holesky', 'localhost'])('returns app.ens.dev on %s', (chainName) => {
    expect(getManagerBaseUrl(chainName)).toBe('https://app.ens.dev')
  })
})
