import { mockFunction } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import extendNamesTransaction from './extendNames'

const mockT = vi.fn((key: string, options?: any) => {
  if (key === 'transaction.extendNames.actionValue') return 'Extend'
  if (key === 'transaction.extendNames.costValue') return `Cost: ${options.value}`
  if (key === 'unit.years') return `${options.count} year`
  if (key === 'unit.months') return `${options.count} months`
  if (key === 'unit.days') return `${options.count} days`
  return key
})

describe('extendNamesTransaction', () => {
  describe('displayItems', () => {
    it('should format display items correctly for a single name', () => {
      const JAN_1_2022_TIMESTAMP = 1640995200000 // 2022-01-01T00:00:00.000Z
      const ONE_YEAR_SECONDS = 31536000

      const data = {
        names: ['test.eth'],
        duration: ONE_YEAR_SECONDS,
        startDateTimestamp: JAN_1_2022_TIMESTAMP,
        displayPrice: '0.1 ETH',
      }

      const result = extendNamesTransaction.displayItems(data, mockT)

      expect(result).toEqual([
        {
          label: 'name',
          value: 'test.eth',
          type: 'name',
        },
        {
          label: 'action',
          value: 'Extend',
        },
        {
          label: 'duration',
          type: 'duration',
          value: {
            duration: '1 year',
            newExpiry: 'January 1, 2023',
          },
        },
        {
          label: 'cost',
          value: 'Cost: 0.1 ETH',
        },
      ])
    })

    it('should format display items correctly for multiple names', () => {
      const JAN_1_2022_TIMESTAMP = 1640995200000 // 2022-01-01T00:00:00.000Z
      const ONE_YEAR_SECONDS = 31536000

      const data = {
        names: ['test1.eth', 'test2.eth'],
        duration: ONE_YEAR_SECONDS,
        startDateTimestamp: JAN_1_2022_TIMESTAMP,
        displayPrice: '0.2 ETH',
      }

      const result = extendNamesTransaction.displayItems(data, mockT)

      expect(result).toEqual([
        {
          label: 'name',
          value: '2 names',
          type: undefined,
        },
        {
          label: 'action',
          value: 'Extend',
        },
        {
          label: 'duration',
          type: 'duration',
          value: {
            duration: '1 year',
            newExpiry: 'January 1, 2023',
          },
        },
        {
          label: 'cost',
          value: 'Cost: 0.2 ETH',
        },
      ])
    })

    it('should handle different duration values', () => {
      const JAN_1_2022_TIMESTAMP = 1640995200000 // 2022-01-01T00:00:00.000Z

      const testCases = [
        {
          duration: 2592000,
          expectedDuration: '30 days',
          expectedExpiry: 'January 31, 2022',
        },
        {
          duration: 15768000,
          expectedDuration: '6 months, 1 days',
          expectedExpiry: 'July 2, 2022',
        },
        {
          duration: 31536000,
          expectedDuration: '1 year',
          expectedExpiry: 'January 1, 2023',
        },
        {
          duration: 157680000,
          expectedDuration: '4 year, 11 months',
          expectedExpiry: 'December 31, 2026',
        },
      ]

      testCases.forEach(({ duration, expectedDuration, expectedExpiry }) => {
        const data = {
          names: ['test.eth'],
          duration,
          startDateTimestamp: JAN_1_2022_TIMESTAMP,
          displayPrice: '0.1 ETH',
        }

        const result = extendNamesTransaction.displayItems(data, mockT)
        expect(result[2]).toEqual({
          label: 'duration',
          type: 'duration',
          value: {
            duration: expectedDuration,
            newExpiry: expectedExpiry,
          },
        })
      })
    })
  })
})
