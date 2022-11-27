import { BigNumber } from 'ethers'

import { ReturnedENS } from '@app/types'

import { getRegistrationStatus } from './registrationStatus'

const ownerData: { [key: string]: ReturnedENS['getOwner'] } = {
  default: {
    owner: '0x123',
    ownershipLevel: 'registrar',
  },
  wrapped: {
    owner: '0x123',
    ownershipLevel: 'nameWrapper',
  },
  subdomain: {
    owner: '0x123',
    ownershipLevel: 'registry',
  },
}

const wrapperData: ReturnedENS['getWrapperData'] = {
  fuseObj: {
    CAN_DO_EVERYTHING: true,
    CANNOT_BURN_FUSES: false,
    CANNOT_TRANSFER: false,
    CANNOT_UNWRAP: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    PARENT_CANNOT_CONTROL: false,
    CANNOT_CREATE_SUBDOMAIN: false,
  },
  expiryDate: new Date(),
  rawFuses: BigNumber.from(0),
  owner: '0x123',
}

describe('getRegistrationStatus', () => {
  describe('2LD .eth', () => {
    it('should return short if a name is less than 3 characters', async () => {
      const result = await getRegistrationStatus({ name: 'a.eth' })
      expect(result).toBe('short')
    })

    it('should return invalid if no values are provided', async () => {
      const result = await getRegistrationStatus({ name: 'test.eth' })
      expect(result).toBe('invalid')
    })

    it('should return registered if expiry is in the future', async () => {
      const expiryData = {
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        gracePeriod: 60 * 60 * 24 * 1000,
      }
      const result = await getRegistrationStatus({
        name: 'test.eth',
        ownerData: ownerData.default,
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
      const result = await getRegistrationStatus({
        name: 'test.eth',
        ownerData: ownerData.default,
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

      const result = await getRegistrationStatus({
        name: 'test.eth',
        ownerData: ownerData.default,
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

      const result = await getRegistrationStatus({
        name: 'test.eth',
        ownerData: ownerData.default,
        wrapperData,
        expiryData,
        priceData,
      })

      expect(result).toBe('available')
    })
  })

  it('should return registered if name has an owner', async () => {
    const result = await getRegistrationStatus({
      name: 'example.com',
      ownerData: ownerData.default,
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('registered')
  })

  it('should return not owned if name has no owner, and has more than 2 labels', async () => {
    const result = await getRegistrationStatus({
      name: 'test.test.eth',
      wrapperData,
    })
    expect(result).toBe('notOwned')
  })

  it('should return not imported otherwise', async () => {
    const result = await getRegistrationStatus({
      name: 'test.com',
      wrapperData,
      supportedTLD: true,
    })
    expect(result).toBe('notImported')
  })
})
