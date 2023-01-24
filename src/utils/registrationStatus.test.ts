import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { ReturnedENS } from '@app/types'

import { getRegistrationStatus } from './registrationStatus'

const ownerData: ReturnedENS['getOwner'] = {
  owner: '0x123',
  ownershipLevel: 'registrar',
}

const wrapperData: ReturnedENS['getWrapperData'] = {
  child: {
    CAN_DO_EVERYTHING: true,
    CANNOT_BURN_FUSES: false,
    CANNOT_TRANSFER: false,
    CANNOT_UNWRAP: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    CANNOT_CREATE_SUBDOMAIN: false,
  },
  parent: {
    PARENT_CANNOT_CONTROL: false,
  },
  expiryDate: new Date(),
  rawFuses: 0,
  owner: '0x123',
} as ReturnedENS['getWrapperData']

describe('getRegistrationStatus', () => {
  describe('2LD .eth', () => {
    it('should return short if a name is less than 3 characters', async () => {
      const result = getRegistrationStatus({ name: 'a.eth' })
      expect(result).toBe('short')
    })

    it('should return invalid if no values are provided', async () => {
      const result = getRegistrationStatus({ name: 'test.eth' })
      expect(result).toBe('invalid')
    })

    it('should return registered if expiry is in the future', async () => {
      const expiryData = {
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        gracePeriod: 60 * 60 * 24 * 1000,
      }
      const result = getRegistrationStatus({
        name: 'test.eth',
        ownerData,
        wrapperData,
        expiryData,
      })
      expect(result).toBe('registered')
    })

    it('should return grace period if expiry is in the past, but within grace period', async () => {
      const expiryData = {
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 60 * 60 * 24 * 1000,
      }
      const result = getRegistrationStatus({
        name: 'test.eth',
        ownerData,
        wrapperData,
        expiryData,
      })
      expect(result).toBe('gracePeriod')
    })

    it('should return premium if premium is greater than 0', async () => {
      const expiryData = {
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 0,
      }

      const priceData = {
        base: BigNumber.from(1),
        premium: BigNumber.from(1),
      }

      const result = getRegistrationStatus({
        name: 'test.eth',
        ownerData,
        wrapperData,
        expiryData,
        priceData,
      })
      expect(result).toBe('premium')
    })

    it('should otherwise return available', async () => {
      const expiryData = {
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 0,
      }
      const priceData = {
        base: BigNumber.from(1),
        premium: BigNumber.from(0),
      }

      const result = getRegistrationStatus({
        name: 'test.eth',
        ownerData,
        wrapperData,
        expiryData,
        priceData,
      })

      expect(result).toBe('available')
    })
  })

  it('should return not owned if name has no owner, and has more than 2 labels', async () => {
    const result = getRegistrationStatus({
      name: 'test.test.eth',
      wrapperData,
    })
    expect(result).toBe('notOwned')
  })

  it('should not return short if subdomain is short', () => {
    const result = getRegistrationStatus({
      name: 'a.test.eth',
      wrapperData,
    })
    expect(result).toBe('notOwned')
  })

  it('should return registered if name has an owner', async () => {
    const result = getRegistrationStatus({
      name: 'example.com',
      ownerData,
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('registered')
  })

  it('should return not supported tld if supportedTLD is falsy', () => {
    const result = getRegistrationStatus({
      name: 'test.com',
      wrapperData,
    })
    expect(result).toBe('unsupportedTLD')
  })

  it('should not return short if name is short but is not .eth', () => {
    const result = getRegistrationStatus({
      name: 'a.com',
      wrapperData,
      supportedTLD: true,
    })
    expect(result).not.toBe('short')
  })

  it('should return not imported otherwise', async () => {
    const result = getRegistrationStatus({
      name: 'test.com',
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('notImported')
  })
})
