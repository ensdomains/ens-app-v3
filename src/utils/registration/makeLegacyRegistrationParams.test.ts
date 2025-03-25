import { describe, expect, expectTypeOf, it } from 'vitest'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'

import { makeLegacyRegistrationParams } from './makeLegacyRegistrationParams'

describe('makeLegacyRegistrationParams', () => {
  it('should return owner as address if no eth record exists', () => {
    const params: RegistrationParameters = {
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
      resolverAddress: '0xresolverAddress',
    }

    expect(makeLegacyRegistrationParams(params)).toEqual({
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
      resolverAddress: '0xresolverAddress',
      address: '0xowner',
    })
  })

  it('should return address from eth record if it exists', () => {
    const params: RegistrationParameters = {
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
      resolverAddress: '0xresolverAddress',
      records: {
        coins: [{ coin: 'eth', value: '0xother' }],
      },
    }

    expect(makeLegacyRegistrationParams(params)).toEqual({
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
      resolverAddress: '0xresolverAddress',
      address: '0xother',
    })
  })
})
