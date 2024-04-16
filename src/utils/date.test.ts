import { describe, expect, it } from 'vitest'

import { roundDurationWithDay, safeDateObj, secondsToDate } from './date'

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
  it('should return an exact second difference with precision to a day', () => {
    const now = Math.floor(new Date(2024, 11, 11, 11, 11).getTime() / 1000)
    const date = new Date(2024, 12, 11, 11, 11)
    const duration = roundDurationWithDay(date, now)
    expect(secondsToDate(now + duration).getDate()).toEqual(date.getDate())
  })
  it('should not add any extra seconds if the difference is less than 12 hours', () => {
    const now = Math.floor(new Date(2024, 11, 11, 23, 59).getTime() / 1000)
    const date = new Date(2024, 12, 12, 0, 1)
    const duration = roundDurationWithDay(date, now)
    expect(secondsToDate(now + duration).getDate()).toEqual(date.getDate())
  })
  it('should add extra seconds for a difference more than 12 hours', () => {
    const now = Math.floor(new Date(2024, 11, 11, 8, 0).getTime() / 1000)
    const date = new Date(2024, 12, 11, 20, 0)
    const duration = roundDurationWithDay(date, now)
    expect(secondsToDate(now + duration).getDate()).toEqual(date.getDate() + 1)
  })
})
