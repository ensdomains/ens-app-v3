import { describe, expect, it, vi } from 'vitest'

import { calculateTimeDiff, displayCountdown } from './useDurationCountdown'

const makeDiff = (str: string) => {
  const [years, months, days, hours, minutes] = str.split('-').map(Number)
  return { years, months, days, hours, minutes }
}

describe('calculateTimeeDiff', () => {
  const date = new Date('2024-01-01T00:00')
  vi.useFakeTimers()
  vi.setSystemTime(date)

  it.each([
    [undefined, undefined],
    ['2023-12-31T00:00', null],
    ['2023-12-31T23:59', null],
    ['2024-01-01T00:00', '0-0-0-0-0'],
    ['2024-01-01T00:01', '0-0-0-0-1'],
    ['2024-01-01T01:01', '0-0-0-1-1'],
    ['2024-01-01T01:01', '0-0-0-1-1'],
    ['2024-01-02T01:01', '0-0-1-1-1'],
  ])('should return correct result for %s', (date, diffStr) => {
    const endDate = date ? new Date(date) : undefined
    const result = diffStr ? makeDiff(diffStr) : diffStr
    expect(calculateTimeDiff(endDate)).toEqual(result)
  })
})

describe('displayCountdown', () => {
  const date = new Date('2024-01-01T00:00')
  vi.useFakeTimers()
  vi.setSystemTime(date)

  it.each([
    ['1 unit.minutes', '0-0-0-0-0'],
    ['1 unit.minutes', '0-0-0-0-1'],
    ['59 unit.minutes', '0-0-0-0-59'],
    ['1 unit.hours / 1 unit.minutes', '0-0-0-1-1'],
    ['1 unit.hours / 30 unit.minutes', '0-0-0-1-30'],
    ['2 unit.hours', '0-0-0-1-31'],
    ['2 unit.hours', '0-0-0-2-0'],
    ['1 unit.days', '0-0-1-1-1'],
    ['1 unit.months', '0-1-1-1-1'],
    ['1 unit.years', '1-1-1-1-1'],
  ])('should return %s for diff interval %s', (result, diffInterval) => {
    const diff = makeDiff(diffInterval)
    expect(
      displayCountdown({
        diff,
        t: ((x: string, opts: any) => `${opts.count} ${x}`) as any,
      }),
    ).toEqual(result)
  })
})
