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
    it('should return short if a name is short', async () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation: { isETH: true, is2LD: true, isShort: true },
      })
      expect(result).toBe('short')
    })

    it('should return invalid if no values are provided', async () => {
      const result = getRegistrationStatus({ timestamp: Date.now(), validation: {} })
      expect(result).toBe('invalid')
    })

    it('should return registered if expiry is in the future', async () => {
      const expiryData = {
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        gracePeriod: 60 * 60 * 24 * 1000,
      }
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
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
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
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
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
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
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
        ownerData,
        wrapperData,
        expiryData,
        priceData,
      })

      expect(result).toBe('available')
    })

    it('should use timestamp parameter for comparisons', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now() - 1_000 * 60,
        validation: { is2LD: true, isETH: true },
        ownerData,
        wrapperData,
        expiryData: {
          expiry: new Date(Date.now() - 1_000 * 10),
          gracePeriod: 0,
        },
        supportedTLD: true,
      })
      expect(result).toBe('registered')
    })
  })

  it('should return not owned if name has no owner, and is not 2LD', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: true, type: 'name' },
      wrapperData,
    })
    expect(result).toBe('notOwned')
  })

  it('should not return short if subdomain is short', () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: true, isShort: true, type: 'name' },
      wrapperData,
    })
    expect(result).toBe('notOwned')
  })

  it('should return imported if DNS name has an owner', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: true },
      ownerData,
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('imported')
  })
  it('should return owned if DNS name subname has an owner', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false },
      ownerData,
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('owned')
  })
  it('should return owned if name has an owner', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: true },
      ownerData,
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('owned')
  })

  it('should return not supported tld if supportedTLD is falsy', () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: false },
      wrapperData,
    })
    expect(result).toBe('unsupportedTLD')
  })

  it('should not return short if name is short but is not .eth', () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: false, isShort: true },
      wrapperData,
      supportedTLD: true,
    })
    expect(result).not.toBe('short')
  })

  it('should return not imported otherwise', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, isETH: false },
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('notImported')
  })
})
