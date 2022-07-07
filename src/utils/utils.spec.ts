import {
  shortenAddress,
  secondsToDays,
  yearsToSeconds,
  formatExpiry,
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
    expect(result).toEqual('\nJanuary 1, 2020')
  })
})
