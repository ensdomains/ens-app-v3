import { describe, expect, it } from 'vitest'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { getRegistrationStatus } from './registrationStatus'

const ownerData: GetOwnerReturnType = {
  owner: '0x123',
  registrant: '0x123',
  ownershipLevel: 'registrar',
}

const createDateWithValue = (value: number) => ({
  date: new Date(value),
  value: BigInt(value),
})

const wrapperData: GetWrapperDataReturnType = {
  fuses: {
    child: {
      CAN_DO_EVERYTHING: true,
      CANNOT_BURN_FUSES: false,
      CANNOT_TRANSFER: false,
      CANNOT_UNWRAP: false,
      CANNOT_SET_RESOLVER: false,
      CANNOT_SET_TTL: false,
      CANNOT_CREATE_SUBDOMAIN: false,
    } as any,
    parent: {
      PARENT_CANNOT_CONTROL: false,
    } as any,
    value: 0 as any,
  },
  expiry: createDateWithValue(Date.now()),
  owner: '0x123',
}

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
        expiry: createDateWithValue(Date.now() + 1000 * 60 * 60 * 24 * 30),
        gracePeriod: 60 * 60 * 24 * 1000,
        status: 'active',
      } as const
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
        expiry: createDateWithValue(Date.now() - 1000),
        gracePeriod: 60 * 60 * 24 * 1000,
        status: 'gracePeriod',
      } as const
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
        expiry: createDateWithValue(Date.now() - 1000),
        gracePeriod: 0,
        status: 'expired',
      } as const

      const priceData = {
        base: 1n,
        premium: 1n,
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
        expiry: createDateWithValue(Date.now() - 1000),
        gracePeriod: 0,
        status: 'expired',
      } as const
      const priceData = {
        base: 1n,
        premium: 0n,
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
          expiry: createDateWithValue(Date.now() - 1_000 * 10),
          gracePeriod: 0,
          status: 'active',
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

  it('should return offChain if name is not 2LD, is not owned and has an eth address record', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: false, type: 'name' },
      supportedTLD: true,
      wrapperData,
      addrData: { id: 60, name: 'eth', value: '0xF142B308cF687d4358410a4cB885513b30A42025' },
    })
    expect(result).toBe('offChain')
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
  it('should return imported if DNS name has ETH record', async () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: true },
      ownerData,
      wrapperData,
      addrData: { id: 60, name: 'eth', value: '0xF142B308cF687d4358410a4cB885513b30A42025' },
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

  it('should return unsupported tld for .club domains', () => {
    const result = getRegistrationStatus({
      timestamp: Date.now(),
      validation: { is2LD: true, isETH: false },
      name: 'test.club',
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
