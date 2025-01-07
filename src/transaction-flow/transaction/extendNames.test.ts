import { mockFunction } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getPrice } from '@ensdomains/ensjs/public'
import { renewNames } from '@ensdomains/ensjs/wallet'

import { ClientWithEns, ConnectorClientWithEns } from '@app/types'

import extendNamesTransaction from './extendNames'

vi.mock('@ensdomains/ensjs/public')
vi.mock('@ensdomains/ensjs/wallet')

const mockGetPrice = mockFunction(getPrice)
const mockRenewNames = mockFunction(renewNames.makeFunctionData)

describe('extendNamesTransaction', () => {
  const mockClient = {} as ClientWithEns
  const mockConnectorClient = {} as ConnectorClientWithEns

  const mockT = vi.fn((key: string, options?: any) => {
    if (key === 'transaction.extendNames.actionValue') return 'Extend'
    if (key === 'transaction.extendNames.costValue') return `Cost: ${options.value}`
    if (key === 'unit.years') return `${options.count} year`
    if (key === 'unit.months') return `${options.count} months`
    if (key === 'unit.days') return `${options.count} days`
    return key
  })

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

    it('should return display items without newExpiry when startDateTimestamp is not provided', () => {
      const data = {
        names: ['test.eth'],
        duration: 31536000,
        displayPrice: '1.02',
      }

      const result = extendNamesTransaction.displayItems(data, mockT)
      expect(result[2].value.newExpiry).toBeUndefined()
    })
  })

  describe('transaction', () => {
    beforeEach(() => {
      mockGetPrice.mockReset()
      mockRenewNames.mockReset()
    })

    it('should calculate price and create transaction data', async () => {
      const data = {
        names: ['test.eth'],
        duration: 31536000, // 1 year
      }

      mockGetPrice.mockResolvedValue({ base: BigInt('1000000000000000000'), premium: 0n }) // 1 ETH
      mockRenewNames.mockResolvedValue({
        to: '0x123' as Address,
        data: '0x456' as Hex,
        value: BigInt('1020000000000000000'), // 1.02 ETH (with 2% buffer)
      })

      const result = await extendNamesTransaction.transaction({
        client: mockClient,
        connectorClient: mockConnectorClient,
        data,
      })

      expect(mockGetPrice).toHaveBeenCalledWith(mockClient, {
        nameOrNames: ['test.eth'],
        duration: 31536000,
      })
      expect(mockRenewNames).toHaveBeenCalledWith(mockConnectorClient, {
        nameOrNames: ['test.eth'],
        duration: 31536000,
        value: BigInt('1020000000000000000'),
      })
      expect(result).toEqual({
        to: '0x123',
        data: '0x456',
        value: BigInt('1020000000000000000'),
      })
    })

    it('should throw error when price is not found', async () => {
      const data = {
        names: ['test.eth'],
        duration: 31536000,
      }

      mockGetPrice.mockResolvedValue(null)

      await expect(
        extendNamesTransaction.transaction({
          client: mockClient,
          connectorClient: mockConnectorClient,
          data,
        }),
      ).rejects.toThrow('No price found')
    })
  })
})
