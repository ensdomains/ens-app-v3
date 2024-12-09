import { describe, expect, it } from 'vitest'

import {
  calculateDatesDiff,
  dateFromDateDiff,
  roundDurationWithDay,
  safeDateObj,
  secondsFromDateDiff,
} from './date'
import { ONE_DAY, ONE_YEAR } from './time'

describe('safeDateObj', () => {
  it('should return a date object for a date object', () => {
    expect(safeDateObj(new Date(3255803954000))?.getTime()).toEqual(
      new Date(3255803954000).getTime(),
    )
  })

  it('should return a date object for a timestamp', () => {
    expect(safeDateObj(3255803954000)?.getTime()).toEqual(new Date(3255803954000).getTime())
  })

  it('should return a date object for a string timestamp', () => {
    const test = new Date('3255803954000')
    expect(safeDateObj('3255803954000')?.getTime()).toEqual(new Date(3255803954000).getTime())
  })

  it('should return a date object for a date string', () => {
    expect(safeDateObj('2073-03-03T21:59:14.000Z')?.getTime()).toEqual(
      new Date(3255803954000).getTime(),
    )
  })
})

describe('roundDurationWithDay', () => {
  it('should return a duration of 1 day if the difference is less than 12 hours', () => {
    const now = Math.floor(new Date(2024, 11, 11, 20, 0).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

  it('should return a duration of 1 day if difference is more than 12 hours', () => {
    const now = Math.floor(new Date(2024, 11, 11, 0, 0).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

  it('should return a duration of 1 day if the difference is exactly 1/2 day', () => {
    const now = Math.floor(new Date(2024, 11, 11, 12, 0).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

  it('should return a duration of 1 day if the difference is exactly 1 day', () => {
    const now = Math.floor(new Date(2024, 11, 11, 0, 0).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })
})

describe('dateFromDateDiff', () => {
  it('should return 1 month from Jan 1, 2024', () => {
    const newDate = dateFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalMonths: 1,
    })
    expect(newDate.getFullYear()).toBe(2024)
    expect(newDate.getMonth() + 1).toBe(2)
    expect(newDate.getDate()).toBe(1)
  })

  it('should return 1 year from Jan 1, 2024', () => {
    const newDate = dateFromDateDiff({ startDate: new Date(2024, 0, 1, 0, 0), additionalYears: 1 })
    expect(newDate.getFullYear()).toBe(2025)
    expect(newDate.getMonth() + 1).toBe(1)
    expect(newDate.getDate()).toBe(1)
  })

  it('should return 1 day from Jan 1, 2024', () => {
    const newDate = dateFromDateDiff({ startDate: new Date(2024, 0, 1, 0, 0), additionalDays: 1 })
    expect(newDate.getFullYear()).toBe(2024)
    expect(newDate.getMonth() + 1).toBe(1)
    expect(newDate.getDate()).toBe(2)
  })

  it('should return 2 years and 4 months from Jan 1, 2024 by using months', () => {
    const newDate = dateFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalMonths: 28,
    })
    expect(newDate.getFullYear()).toBe(2026)
    expect(newDate.getMonth() + 1).toBe(5)
    expect(newDate.getDate()).toBe(1)
  })

  it('should return  60 days from Jan 1, 2024', () => {
    const newDate = dateFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalDays: 60,
    })

    expect(newDate.getFullYear()).toBe(2024)
    expect(newDate.getMonth() + 1).toBe(3)
    expect(newDate.getDate()).toBe(1)
  })
})

describe('secondsFromDateDiff', () => {
  it('should return 1 month from Jan 1, 2024 in seconds', () => {
    const secondsFromDate = secondsFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalMonths: 1,
    })
    expect(secondsFromDate).toBe(ONE_DAY * 31)
  })

  it('should return 1 year from Jan 1, 2024', () => {
    const secondsFromDate = secondsFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalYears: 1,
    })
    expect(secondsFromDate).toBe(ONE_YEAR + ONE_DAY)
  })

  it('should return 1 day from Jan 1, 2024', () => {
    const secondsFromDate = secondsFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalDays: 1,
    })
    expect(secondsFromDate).toBe(ONE_DAY)
  })

  it('should return 2 years and 1 months from Jan 1, 2024 by using months', () => {
    const secondsFromDate = secondsFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalMonths: 25,
    })
    // 32 days due to leap year
    expect(secondsFromDate).toBe(ONE_YEAR * 2 + ONE_DAY * 32)
  })

  it('should return  60 days from Jan 1, 2024', () => {
    const secondsFromDate = secondsFromDateDiff({
      startDate: new Date(2024, 0, 1, 0, 0),
      additionalDays: 60,
    })
    expect(secondsFromDate).toBe(ONE_DAY * 60)
  })
})

describe('calculateDateDiff', () => {
  it.each([
    ['2024-01-10', '2025-01-10', '1-0-0'],
    ['2024-01-10', '2024-02-10', '0-1-0'],
    ['2024-01-10', '2024-01-11', '0-0-1'],
    ['2024-01-10', '2025-01-9', '0-11-30'],
    ['2024-03-10', '2025-03-9', '0-11-27'],
    ['2023-03-10', '2024-03-9', '0-11-28'], // leap year
    ['2024-04-10', '2025-04-9', '0-11-30'],
    ['2024-04-10', '2025-04-10', '1-0-0'],
    ['2024-11-10', '2026-05-1', '1-5-21'],
  ])(`should return correct diff from %s to %s`, (date1, date2, result) => {
    const startDate = new Date(date1)
    const endDate = new Date(date2)

    const toUnit = (i: number) => (i === 0 ? 'years' : i === 1 ? 'months' : 'days')
    const dateDiff = Object.fromEntries(
      result.split('-').map((value, i) => [toUnit(i), parseInt(value)]),
    )

    expect(calculateDatesDiff(startDate, endDate)).toEqual({ diff: dateDiff, isNegative: false })
  })
})
