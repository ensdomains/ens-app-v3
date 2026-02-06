import { describe, expect, it } from 'vitest'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { getRegistrationStatus } from './registrationStatus'

const ownerData: GetOwnerReturnType = {
  owner: '0x123',
  registrant: '0x123',
  ownershipLevel: 'registrar',
}

const ownerDataNameWrapper: GetOwnerReturnType = {
  owner: '0x123',
  ownershipLevel: 'nameWrapper',
}

const ownerDataNameWrapperEmpty: GetOwnerReturnType = {
  owner: '0x0000000000000000000000000000000000000000',
  ownershipLevel: 'nameWrapper',
}

const GRACE_PERIOD = 7776000 // 90 days in seconds

// Creates a date object with value in milliseconds (legacy helper for non-synced tests)
const createDateWithValue = (value: number) => ({
  date: new Date(value),
  value: BigInt(value),
})

// Creates a date object with value in seconds (blockchain timestamps)
const createDateWithValueInSeconds = (valueInSeconds: number) => ({
  date: new Date(valueInSeconds * 1000),
  value: BigInt(valueInSeconds),
})

// Creates properly synced wrapper and expiry data
// For synced names: wrapperExpiry === registrarExpiry + gracePeriod
const createSyncedWrapperAndExpiryData = (registrarExpirySeconds: number) => {
  const wrapperExpirySeconds = registrarExpirySeconds + GRACE_PERIOD
  return {
    wrapperData: {
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
      expiry: createDateWithValueInSeconds(wrapperExpirySeconds),
      owner: '0x123',
    } satisfies GetWrapperDataReturnType,
    expiryData: {
      expiry: createDateWithValueInSeconds(registrarExpirySeconds),
      gracePeriod: GRACE_PERIOD,
      status: 'active' as const,
    },
  }
}

// Legacy wrapperData for tests that don't need synced data
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
  expiry: createDateWithValueInSeconds(Math.floor(Date.now() / 1000)),
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
      // Registrar expiry 30 days in the future
      const registrarExpirySeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
      const { wrapperData: syncedWrapperData, expiryData } =
        createSyncedWrapperAndExpiryData(registrarExpirySeconds)
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
        ownerData,
        wrapperData: syncedWrapperData,
        expiryData,
      })
      expect(result).toBe('registered')
    })

    it('should return grace period if expiry is in the past, but within grace period', async () => {
      // Registrar expiry 1 second in the past (still within grace period)
      const registrarExpirySeconds = Math.floor(Date.now() / 1000) - 1
      const { wrapperData: syncedWrapperData, expiryData } =
        createSyncedWrapperAndExpiryData(registrarExpirySeconds)
      const result = getRegistrationStatus({
        timestamp: Date.now(),
        validation: { is2LD: true, isETH: true },
        ownerData,
        wrapperData: syncedWrapperData,
        expiryData: { ...expiryData, status: 'gracePeriod' as const },
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
      // Registrar expiry 10 seconds ago, but timestamp is 60 seconds ago
      // so from the timestamp's perspective, the name is still registered
      const registrarExpirySeconds = Math.floor(Date.now() / 1000) - 10
      const { wrapperData: syncedWrapperData, expiryData } =
        createSyncedWrapperAndExpiryData(registrarExpirySeconds)
      const result = getRegistrationStatus({
        timestamp: Date.now() - 1_000 * 60,
        validation: { is2LD: true, isETH: true },
        ownerData,
        wrapperData: syncedWrapperData,
        expiryData,
        supportedTLD: true,
      })
      expect(result).toBe('registered')
    })

    describe('proactive desync detection', () => {
      it('should return desynced when wrapper expiry does not match registrar + grace period (active period)', () => {
        // Simulate a name renewed via legacy controller:
        // - Registrar expiry was extended (30 days in the future)
        // - Wrapper expiry was NOT updated (still at old value, e.g., 10 days ago + grace period)
        const nowSeconds = Math.floor(Date.now() / 1000)
        const registrarExpirySeconds = nowSeconds + 60 * 60 * 24 * 30 // 30 days in future
        const oldWrapperExpirySeconds = nowSeconds - 60 * 60 * 24 * 10 + GRACE_PERIOD // Old expiry + grace

        const desyncedWrapperData: GetWrapperDataReturnType = {
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
          expiry: createDateWithValueInSeconds(oldWrapperExpirySeconds),
          owner: '0x123', // Owner is still visible (not 0x0)
        }

        const result = getRegistrationStatus({
          timestamp: Date.now(),
          validation: { is2LD: true, isETH: true },
          ownerData: ownerDataNameWrapper,
          wrapperData: desyncedWrapperData,
          expiryData: {
            expiry: createDateWithValueInSeconds(registrarExpirySeconds),
            gracePeriod: GRACE_PERIOD,
            status: 'active',
          },
        })
        expect(result).toBe('desynced')
      })

      it('should return desynced:gracePeriod when wrapper expiry does not match registrar + grace period (grace period)', () => {
        // Registrar expiry 10 days ago (within 90-day grace period)
        // Wrapper expiry is mismatched
        const nowSeconds = Math.floor(Date.now() / 1000)
        const registrarExpirySeconds = nowSeconds - 60 * 60 * 24 * 10 // 10 days ago
        const oldWrapperExpirySeconds = nowSeconds - 60 * 60 * 24 * 100 + GRACE_PERIOD // Much older

        const desyncedWrapperData: GetWrapperDataReturnType = {
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
          expiry: createDateWithValueInSeconds(oldWrapperExpirySeconds),
          owner: '0x123',
        }

        const result = getRegistrationStatus({
          timestamp: Date.now(),
          validation: { is2LD: true, isETH: true },
          ownerData: ownerDataNameWrapper,
          wrapperData: desyncedWrapperData,
          expiryData: {
            expiry: createDateWithValueInSeconds(registrarExpirySeconds),
            gracePeriod: GRACE_PERIOD,
            status: 'gracePeriod',
          },
        })
        expect(result).toBe('desynced:gracePeriod')
      })

      it('should return registered when expiries are properly synced', () => {
        const registrarExpirySeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        const { wrapperData: syncedWrapperData, expiryData } =
          createSyncedWrapperAndExpiryData(registrarExpirySeconds)

        const result = getRegistrationStatus({
          timestamp: Date.now(),
          validation: { is2LD: true, isETH: true },
          ownerData: ownerDataNameWrapper,
          wrapperData: syncedWrapperData,
          expiryData,
        })
        expect(result).toBe('registered')
      })

      it('should not detect desync for unwrapped names (no wrapperData)', () => {
        const registrarExpirySeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30

        const result = getRegistrationStatus({
          timestamp: Date.now(),
          validation: { is2LD: true, isETH: true },
          ownerData: {
            owner: '0x123',
            registrant: '0x123',
            ownershipLevel: 'registrar',
          },
          wrapperData: undefined,
          expiryData: {
            expiry: createDateWithValueInSeconds(registrarExpirySeconds),
            gracePeriod: GRACE_PERIOD,
            status: 'active',
          },
        })
        expect(result).toBe('registered')
      })

      it('should still detect desynced via fallback when owner is emptyAddress', () => {
        // This tests the fallback path where wrapper has fully expired
        // and owner shows as 0x0
        const registrarExpirySeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        const { wrapperData: syncedWrapperData, expiryData } =
          createSyncedWrapperAndExpiryData(registrarExpirySeconds)

        const result = getRegistrationStatus({
          timestamp: Date.now(),
          validation: { is2LD: true, isETH: true },
          ownerData: ownerDataNameWrapperEmpty,
          wrapperData: syncedWrapperData,
          expiryData,
        })
        expect(result).toBe('desynced')
      })
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
