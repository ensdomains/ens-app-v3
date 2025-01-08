import { describe, expect, expectTypeOf, it } from 'vitest'

import { makeLegacyRegistrationParams } from './makeLegacyRegistrationParams'
import { RegistrationParameters } from '@ensdomains/ensjs/utils'

describe('makeLegacyRegistrationParams', () => {
  it('should return base legacy registration parameters', () => {
    const params: RegistrationParameters = {
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
    }

    expect(makeLegacyRegistrationParams(params)).toEqual({
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
    })
  })

  it('should return legacy registration parameters with resolverAddress and address if resolverAddress exists', () => {
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
      }
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

  it('should not return address if resolverAddress is undefined', () => {
    const params: RegistrationParameters = {
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
      records: {
        coins: [{ coin: 'eth', value: '0xother' }],
      }
    }

    expect(makeLegacyRegistrationParams(params)).toEqual({
      name: 'test',
      owner: '0xowner',
      duration: 100,
      secret: '0xsecret',
    })
  })
})
