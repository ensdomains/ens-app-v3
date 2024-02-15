import { describe, expect, it } from 'vitest'

import { getRoles } from './getRoles'

describe('getRoles', () => {
  it('should return an list of roles', () => {
    expect(
      getRoles({
        nameType: 'eth-unwrapped-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        dnsOwner: '0xdnsOwner',
      }),
    ).toEqual([
      { address: '0xregistrant', role: 'owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })
})
