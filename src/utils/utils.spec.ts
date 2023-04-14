import { mockFunction } from '@app/test-utils'

import validateResolver from '@app/validators/validateResolver'

import { NAMEWRAPPER_AWARE_RESOLVERS, emptyAddress } from './constants'
import {
  canEditRecordsWhenWrappedCalc,
  canResolverSetPrimaryName,
  formatExpiry,
  secondsToDays,
  shortenAddress,
  yearsToSeconds,
} from './utils'

jest.mock('@app/validators/validateResolver')
const mockValidateResolver = mockFunction(validateResolver)

describe('shortenAddress', () => {
  it('should NOT shorten address if it is below maxLength', () => {
    const address = '0x0000'
    const maxLength = 10
    const leftSlice = 5
    const rightSlice = 5
    const result = shortenAddress(address, maxLength, leftSlice, rightSlice)
    expect(result).toEqual(address)
  })
  it('should shorten address if it is above maxLength', () => {
    const address = '0x0000000000000000000000000000000000000000'
    const maxLength = 10
    const leftSlice = 5
    const rightSlice = 5
    const result = shortenAddress(address, maxLength, leftSlice, rightSlice)
    expect(result).toEqual('0x000...00000')
  })
})

describe('secondsToDays', () => {
  it('should convert seconds to days', () => {
    const seconds = 60 * 60 * 24 * 365
    const result = secondsToDays(seconds)
    expect(result).toEqual(365)
  })
})

describe('yearsToSeconds', () => {
  it('should convert years to seconds', () => {
    const years = 1
    const result = yearsToSeconds(years)
    expect(result).toEqual(60 * 60 * 24 * 365)
  })
})

describe('formatExpiry', () => {
  it('should format the date as expected', () => {
    const expiry = new Date('2020-01-01')
    const result = formatExpiry(expiry)
    expect(result).toEqual('January 1, 2020')
  })
})

describe('canEditRecordsWhenWrappedCalc', () => {
  it('should return true if the domain is not wrapped', () => {
    const result = canEditRecordsWhenWrappedCalc(false)
    expect(result).toEqual(true)
  })
  it('should return true if the domain is wrapped and has a wrapper aware resolver', () => {
    const result = canEditRecordsWhenWrappedCalc(true, NAMEWRAPPER_AWARE_RESOLVERS[5][0], 5)
    expect(result).toEqual(true)
  })
  it('should return false if the domain is wrapped and does NOT have a wrapper aware resolver', () => {
    const result = canEditRecordsWhenWrappedCalc(true, '0xaddress', 5)
    expect(result).toEqual(false)
  })
})

describe('canResolverSetPrimaryName', () => {
  mockValidateResolver.mockResolvedValue([] as never)

  it('should return false if resolver does not support interface', async () => {
    mockValidateResolver.mockResolvedValueOnce(['does not support interface'] as never)
    const result = await canResolverSetPrimaryName(
      '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
      false,
      {},
      1,
    )
    expect(result).toEqual(false)
  })

  it('should return false if resolver is empty or does not exist', async () => {
    const result = await canResolverSetPrimaryName('', false, {}, 1)
    expect(result).toEqual(false)
    const result2 = await canResolverSetPrimaryName(emptyAddress, false, {}, 1)
    expect(result2).toEqual(false)
  })

  it('should return false if resolver is not wrapper aware and name is wrapped', async () => {
    const result = await canResolverSetPrimaryName('0xnotaware', true, {}, 1)
    expect(result).toEqual(false)
  })

  it('should return true if resolver is wrapper aware and name is wrapped', async () => {
    const result = await canResolverSetPrimaryName(NAMEWRAPPER_AWARE_RESOLVERS[5][0], true, {}, 5)
    expect(result).toEqual(true)
  })

  it('should return true if resolver is not wrapper aware and name is not wrapped', async () => {
    const result = await canResolverSetPrimaryName('0xnotaware', false, {}, 1)
    expect(result).toEqual(true)
  })
})
