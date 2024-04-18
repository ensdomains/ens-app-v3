import { describe, expect, it } from 'vitest'

import { roundDurationWithDay, safeDateObj, secondsToDate } from './date'
import { ONE_DAY } from './time'

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
    const now = Math.floor(new Date(2024, 11, 11, 0, 0 ).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

  it('should return a duration of 1 day if the difference is exactly 1/2 day', () => {
    const now = Math.floor(new Date(2024, 11, 11, 12, 0 ).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

  it('should return a duration of 1 day if the difference is exactly 1 day', () => {
    const now = Math.floor(new Date(2024, 11, 11, 0, 0 ).getTime() / 1000)
    const date = new Date(2024, 11, 12, 0, 0)
    const duration = roundDurationWithDay(date, now)
    expect(duration).toBe(ONE_DAY)
  })

})
