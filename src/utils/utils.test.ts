import { describe, expect, it } from 'vitest'

import {
  calculateValueWithBuffer,
  checkDNSName,
  checkETH2LDFromName,
  checkSubname,
  deleteProperties,
  deleteProperty,
  formatDateTime,
  formatDuration,
  formatExpiry,
  formatFullExpiry,
  getEncodedLabelAmount,
  getLabelFromName,
  getMonthDifferenceDuration,
  getMonthsFromDuration,
  getOneMonthDate,
  getResolverWrapperAwareness,
  getTimeDifferenceDuration,
  isLabelTooLong,
  makeEtherscanLink,
  ONE_DAY,
  ONE_YEAR,
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

describe('getOneMonthDate', () => {
  it('should return January 2025', () => {
    const startDate = new Date('2024-12-15')
    const oneMonthFromStart = getOneMonthDate(startDate)
    expect(oneMonthFromStart.getMonth()).toEqual(0)
    expect(oneMonthFromStart.getFullYear()).toEqual(2025)
  })
  it('should return June 2024', () => {
    const startDate = new Date('2024-05-15')
    const oneMonthFromStart = getOneMonthDate(startDate)
    expect(oneMonthFromStart.getMonth()).toEqual(5)
    expect(oneMonthFromStart.getFullYear()).toEqual(2024)
  })
})

describe('getMonthDifferenceDuration', () => {
  it('should return the duration in seconds for the month', () => {
    const startDate = new Date('2024-01-01')
    const monthDuration = getMonthDifferenceDuration(startDate)
    const janDuration = ONE_DAY * 31
    expect(monthDuration).toEqual(janDuration)
  })
})

describe('getTimeDifferenceDuration', () => {
  const startDate = new Date('2024-01-01')
  it('should return the duration in seconds for the 3 days', () => {
    const endDate = new Date('2024-01-04')
    const durationDiff = getTimeDifferenceDuration(endDate, startDate)
    const actualDuration = ONE_DAY * 3
    expect(durationDiff).toEqual(actualDuration)
  })
  it('should return the duration in seconds for the 1 month and 3 days', () => {
    const endDate = new Date('2024-02-04')
    const durationDiff = getTimeDifferenceDuration(endDate, startDate)
    const actualDuration = ONE_DAY * (3 + 31)
    expect(durationDiff).toEqual(actualDuration)
  })
})

describe('getMonthsFromDuration', () => {
  const startDate = new Date('2024-01-01')
  it('should return 2 months', () => {
    const endDate = new Date('2024-03-01')
    const timeDiff = getTimeDifferenceDuration(endDate, startDate)
    const { months, secLeft } = getMonthsFromDuration(startDate, timeDiff)
    expect(months).toEqual(2)
    expect(secLeft).toEqual(0)
  })
  it('should return 2 months and extra duration', () => {
    const endDate = new Date('2024-03-03')
    const timeDiff = getTimeDifferenceDuration(endDate, startDate)
    const { months, secLeft } = getMonthsFromDuration(startDate, timeDiff)
    expect(months).toEqual(2)
    expect(secLeft).toBeGreaterThan(0)
  })
  it('should return 0 months and inputted duration', () => {
    const endDate = new Date('2024-01-04')
    const timeDiff = getTimeDifferenceDuration(endDate, startDate)
    const { months, secLeft } = getMonthsFromDuration(startDate, timeDiff)
    expect(months).toEqual(0)
    expect(secLeft).toEqual(timeDiff)
  })
})

describe('formatExpiry', () => {
  it('should format the date as expected', () => {
    const expiry = new Date('2020-01-01')
    const result = formatExpiry(expiry)
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

describe('formatDuration', () => {
  const currentDate = new Date()
  const monthDuration = getMonthDifferenceDuration(currentDate)
  it('should return a year locale', () => {
    expect(formatDuration(2 * ONE_YEAR, (x) => x)).toEqual('unit.years')
  })
  it('should return a month locale', () => {
    expect(formatDuration(monthDuration, (x) => x)).toEqual('unit.months')
  })
  it('should return a day locale', () => {
    expect(formatDuration(ONE_DAY * 2, (x) => x)).toEqual('unit.days')
  })
  it('should return invalid date if less than a day', () => {
    expect(formatDuration(123, (x) => x)).toEqual('unit.invalid_date')
  })
  it('if extra day or month, return multiple locales', () => {
    expect(formatDuration(2 * ONE_YEAR + monthDuration, (x) => x)).toEqual(
      'unit.years, unit.months',
    )
    expect(formatDuration(monthDuration + ONE_DAY * 3, (x) => x)).toEqual('unit.months, unit.days')
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
