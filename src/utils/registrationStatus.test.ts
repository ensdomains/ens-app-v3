import { labelhash } from 'viem'
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

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365
const GRACE_PERIOD_IN_SECONDS = 60 * 60 * 24 * 90

describe('getRegistrationStatus', () => {
  // A .eth 2LD below the registrar's three character minimum. `getOwner` and `getExpiry` both
  // return null for a label the registrar has never issued, which is how `12.eth` arrives here.
  describe('short 2LD .eth', () => {
    const validation = { isETH: true, is2LD: true, isShort: true } as const

    it('should return short for a short name that has never been registered', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData: null,
        wrapperData: null,
        expiryData: null,
        name: '12.eth',
      })
      expect(result).toBe('short')
    })

    // on.eth is a two character name registered before the minimum was enforced. It is a real,
    // owned name with a real registrar expiry, so it must read as registered, not as a dead end.
    it('should return registered for a short name that predates the minimum length (on.eth)', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() + 10 * YEAR_IN_MS),
          gracePeriod: GRACE_PERIOD_IN_SECONDS,
          status: 'active',
        },
        name: 'on.eth',
      })
      expect(result).toBe('registered')
    })

    it('should return gracePeriod for a short name whose registration has just lapsed', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() - 1000),
          gracePeriod: GRACE_PERIOD_IN_SECONDS,
          status: 'gracePeriod',
        },
        name: 'on.eth',
      })
      expect(result).toBe('gracePeriod')
    })

    // The registry owner outlives the registration, so a stale non-empty ownerData must not keep
    // an expired short name looking registered — nor make it look registerable.
    it('should return short rather than available once a short name is out of its grace period', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() - 1000),
          gracePeriod: 0,
          status: 'expired',
        },
        priceData: { base: 1n, premium: 0n },
        name: '12.eth',
      })
      expect(result).toBe('short')
    })

    it('should return short rather than premium for an expired short name with a premium', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() - 1000),
          gracePeriod: 0,
          status: 'expired',
        },
        priceData: { base: 1n, premium: 1n },
        name: '12.eth',
      })
      expect(result).toBe('short')
    })
  })

  // A label the subgraph has not healed arrives as an encoded labelhash, which `parseInput` reports
  // as short because there is no output to measure. Shortness is not the only thing unknown about
  // it: registering it would register the bracket string rather than the name behind it, so none of
  // the registerability answers apply, and the name gets the same bland status as any other name the
  // app holds no claim for. The lifecycle answers still apply, because they are keyed by labelhash.
  describe('unhealed label (encoded labelhash) 2LD .eth', () => {
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    const validation = { isETH: true, is2LD: true, isShort: true } as const

    it('should return notOwned rather than short for an unowned encoded label', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData: null,
        wrapperData: null,
        expiryData: null,
        name: encodedName,
      })
      expect(result).toBe('notOwned')
    })

    it('should return notOwned rather than premium for an encoded label past its grace period', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() - 1000),
          gracePeriod: 0,
          status: 'expired',
        },
        priceData: { base: 1n, premium: 1n },
        name: encodedName,
      })
      expect(result).toBe('notOwned')
    })

    it('should still return registered for an owned encoded label', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() + 10 * YEAR_IN_MS),
          gracePeriod: GRACE_PERIOD_IN_SECONDS,
          status: 'active',
        },
        name: encodedName,
      })
      expect(result).toBe('registered')
    })

    it('should still return gracePeriod for an encoded label whose registration has just lapsed', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation,
        ownerData,
        wrapperData: null,
        expiryData: {
          expiry: createDateWithValue(Date.now() - 1000),
          gracePeriod: GRACE_PERIOD_IN_SECONDS,
          status: 'gracePeriod',
        },
        name: encodedName,
      })
      expect(result).toBe('gracePeriod')
    })

    // The name is what the check is made of, so a caller that does not pass one gets no
    // registerability answer either. This is the opposite default from `isShortEth2LD`, which fails
    // open to not-short: there the harm is dead-ending a normal name, here it is offering a name the
    // app cannot identify.
    it('should return notOwned when no name is passed at all', () => {
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation: { isETH: true, is2LD: true, isShort: false },
        ownerData: null,
        wrapperData: null,
        expiryData: null,
      })
      expect(result).toBe('notOwned')
    })
  })

  describe('2LD .eth', () => {
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
        name: 'nick.eth',
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
        name: 'nick.eth',
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
