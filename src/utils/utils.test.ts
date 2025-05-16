import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { holeskyWithEns, mainnetWithEns, sepoliaWithEns } from '@app/constants/chains'

import { dateFromDateDiff } from './date'
import {
  calculateValueWithBuffer,
  checkDNSName,
  checkETH2LDFromName,
  checkSubname,
  deleteProperties,
  deleteProperty,
  formatDateTime,
  formatDurationOfDates,
  formatExpiry,
  formatFullExpiry,
  getEncodedLabelAmount,
  getLabelFromName,
  getResolverWrapperAwareness,
  isLabelTooLong,
  makeEtherscanLink,
  ONE_DAY,
  secondsToDays,
  shortenAddress,
  validateExpiry,
  yearsToSeconds,
} from './utils'

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

  it('should format the date with short month if options.short is true', () => {
    const expiry = new Date('2020-01-01')
    const result = formatExpiry(expiry, { short: true })
    expect(result).toEqual('Jan 1, 2020')
  })

  it('should format the date with long month if options.short is false', () => {
    const expiry = new Date('2020-01-01')
    const result = formatExpiry(expiry, { short: false })
    expect(result).toEqual('January 1, 2020')
  })
})

describe('formatDateTime', () => {
  it('should format time correctly', () => {
    const date = new Date('2020-01-01T00:00:00.000Z')
    const result = formatDateTime(date)
    expect(result).toEqual('24:00:00 UTC')
  })
})

describe('formatFullExpiry', () => {
  it('should format the date and time as expected', () => {
    const expiry = new Date('2020-01-01T00:00:00.000Z')
    const result = formatFullExpiry(expiry)
    expect(result).toEqual('January 1, 2020, 24:00:00 UTC')
  })
  it('should return empty if undefined', () => {
    expect(formatFullExpiry()).toEqual('')
  })
})

describe('formatDurationOfDates', () => {
  it('should return a year locale', () => {
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: dateFromDateDiff({ startDate: new Date(), additionalYears: 1 }),
        t: (x, options: any) => x + options?.count,
      }),
    ).toEqual('unit.years1')
  })
  it('should return a month locale', () => {
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: dateFromDateDiff({ startDate: new Date(), additionalMonths: 1 }),
        t: (x, options: any) => x + options?.count,
      }),
    ).toEqual('unit.months1')
  })
  it('should return a day locale', () => {
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: dateFromDateDiff({ startDate: new Date(), additionalDays: 1 }),
        t: (x, options: any) => x + options?.count,
      }),
    ).toEqual('unit.days1')
  })
  it('should return invalid date if less than a day', () => {
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: new Date(Date.now() + 123 * 1000),
        t: (x, options: any) => x + options?.count,
      }),
    ).toEqual('unit.days0')
  })
  it('if extra day or month, return multiple locales', () => {
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: dateFromDateDiff({
          startDate: new Date(),
          additionalYears: 2,
          additionalMonths: 3,
          additionalDays: 1,
        }),
        t: (x, options: any) => x + options?.count,
      }),
    ).toEqual('unit.years2, unit.months3')
    expect(
      formatDurationOfDates({
        startDate: new Date(),
        endDate: new Date(Date.now() + ONE_DAY * 33 * 1000),
        t: (x) => x,
      }),
    ).toEqual('unit.months, unit.days')
  })
})

describe('makeEtherscanLink', () => {
  it('should use mainnet and /tx if no network/route is defined', () => {
    const data = 'test'
    const result = makeEtherscanLink(data)
    expect(result).toEqual(`https://etherscan.io/tx/${data}`)
  })
  it('should not use subdomain if network is mainnet', () => {
    const data = 'test'
    const network = 'mainnet'
    const result = makeEtherscanLink(data, network)
    expect(result).toEqual(`https://etherscan.io/tx/${data}`)
  })
  it('should use subdomain if network is not mainnet', () => {
    const data = 'test'
    const network = 'sepolia'
    const result = makeEtherscanLink(data, network)
    expect(result).toEqual(`https://${network}.etherscan.io/tx/${data}`)
  })
  it('should allow custom route', () => {
    const data = 'test'
    const network = 'sepolia'
    const route = 'address'
    const result = makeEtherscanLink(data, network, route)
    expect(result).toEqual(`https://${network}.etherscan.io/address/${data}`)
  })
})

describe('checkDNSName', () => {
  it('should return true when name is a DNS name', () => {
    const name = 'test.com'
    const result = checkDNSName(name)
    expect(result).toEqual(true)
  })
  it('should return false when name is undefined', () => {
    const name = undefined
    const result = checkDNSName(name as any)
    expect(result).toEqual(false)
  })
  it('should return false when name is a .eth name', () => {
    const name = 'test.eth'
    const result = checkDNSName(name)
    expect(result).toEqual(false)
  })
})

describe('checkETH2LDFromName', () => {
  it('should return true when name is a .eth name', () => {
    const name = 'test.eth'
    const result = checkETH2LDFromName(name)
    expect(result).toEqual(true)
  })
  it('should return false when name is DNS name', () => {
    const name = 'test.com'
    const result = checkETH2LDFromName(name)
    expect(result).toEqual(false)
  })
})

describe('checkSubname', () => {
  it('should return true when name has more than 2 labels', () => {
    const name = 'sub.test.eth'
    const result = checkSubname(name)
    expect(result).toEqual(true)
  })
  it('should return false when name has 2 labels', () => {
    const name = 'test.eth'
    const result = checkSubname(name)
    expect(result).toEqual(false)
  })
})

describe('isLabelTooLong', () => {
  it('should return true when label is too long', () => {
    const label = 'a'.repeat(256)
    const result = isLabelTooLong(label)
    expect(result).toEqual(true)
  })
  it('should return false when label is not too long', () => {
    const label = 'a'.repeat(255)
    const result = isLabelTooLong(label)
    expect(result).toEqual(false)
  })
})

describe('deleteProperty', () => {
  it('should delete property from object', () => {
    const obj = { a: 1, b: 2 }
    const result = deleteProperty('a', obj)
    expect(result).toEqual({ b: 2 })
  })
})

describe('deleteProperties', () => {
  it('should delete properties from object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = deleteProperties(obj, 'a', 'b')
    expect(result).toEqual({ c: 3 })
  })
})

describe('getLabelFromName', () => {
  it('should get first label from name', () => {
    const name = 'sub.test.eth'
    const result = getLabelFromName(name)
    expect(result).toEqual('sub')
  })
})

describe('validateExpiry', () => {
  it('should return expiry when name is 2ld .eth', () => {
    const name = 'test.eth'
    const expiry = new Date()
    const result = validateExpiry({ name, expiry, fuses: {} as any })
    expect(result).toEqual(expiry)
  })
  it('should return undefined when fuses is undefined and name is not 2ld .eth', () => {
    const name = 'test.com'
    const expiry = new Date()
    const result = validateExpiry({ name, expiry, fuses: undefined as any })
    expect(result).toEqual(undefined)
  })
  it('should return expiry when pccExpired', () => {
    const name = 'test.com'
    const expiry = new Date()
    const result = validateExpiry({ name, expiry, fuses: {} as any, pccExpired: true })
    expect(result).toEqual(expiry)
  })
  it('should return undefined when PCC not burned and not 2ld .eth', () => {
    const name = 'test.com'
    const expiry = new Date()
    const result = validateExpiry({
      name,
      expiry,
      fuses: { parent: { PARENT_CANNOT_CONTROL: false } } as any,
    })
    expect(result).toEqual(undefined)
  })
  it('should return expiry when PCC burned and not 2ld .eth', () => {
    const name = 'test.com'
    const expiry = new Date()
    const result = validateExpiry({
      name,
      expiry,
      fuses: { parent: { PARENT_CANNOT_CONTROL: true } } as any,
    })
    expect(result).toEqual(expiry)
  })
})

describe('getResolverWrapperAwareness', () => {
  it('should return false for unknown resolver', () => {
    const chainId = 1
    const resolverAddress = '0xunknown'
    const result = getResolverWrapperAwareness({ chainId, resolverAddress })
    expect(result).toEqual(false)
  })
  it('should return false for known resolver that is not wrapper aware', () => {
    const chainId = 1
    const resolverAddress = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
    const result = getResolverWrapperAwareness({ chainId, resolverAddress })
    expect(result).toEqual(false)
  })
  it('should return true for known resolver that is wrapper aware', () => {
    const chainId = 1
    const resolverAddress = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63'
    const result = getResolverWrapperAwareness({ chainId, resolverAddress })
    expect(result).toEqual(true)
  })
})

describe('calculateValueWithBuffer', () => {
  it('should return value with buffer', () => {
    const value = 123456789n
    const result = calculateValueWithBuffer(value)
    expect(result).toEqual(125925924n)
  })
})

describe('getEncodedLabelAmount', () => {
  it('should return 0 for name with no encoded labels', () => {
    const name = 'test.eth'
    const result = getEncodedLabelAmount(name)
    expect(result).toEqual(0)
  })
  it('should return 1 for name with 1 encoded label', () => {
    const name = '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].test.eth'
    const result = getEncodedLabelAmount(name)
    expect(result).toEqual(1)
  })
  it('should return 2 for name with 2 encoded labels', () => {
    const name =
      '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].eth'
    const result = getEncodedLabelAmount(name)
    expect(result).toEqual(2)
  })
})
