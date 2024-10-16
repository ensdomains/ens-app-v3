import { mockFunction } from '@app/test-utils'

import { call } from 'viem/actions'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getOwner } from '@ensdomains/ensjs/public'

import { ClientWithEns } from '@app/types'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'

import { getOwnerQueryFn } from './useOwner'

vi.mock('@ensdomains/ensjs/public')
vi.mock('viem/actions')
vi.mock('@app/utils/getSupportedChainContractAddress')

const mockGetOwner = mockFunction(getOwner)
const mockGetSupportedChainContractAddress = mockFunction(getSupportedChainContractAddress)
const mockCall = mockFunction(call)

const mockRequest = vi.fn()
const mockClient = {
  chain: {
    id: 1,
  },
  request: mockRequest,
} as unknown as ClientWithEns
const mockConfig = {
  getClient: () => mockClient,
}

describe('getOwnerQueryFn', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  it('should return the owner for a valid name', async () => {
    mockGetOwner.mockResolvedValue({ owner: '0x1234567890123456789012345678901234567890' })

    const queryFn = getOwnerQueryFn(mockConfig)
    const result = await queryFn({ queryKey: [{ name: 'test.eth' }, 1] })

    expect(result).toStrictEqual({ owner: '0x1234567890123456789012345678901234567890' })
    expect(mockGetOwner).toHaveBeenCalledWith(mockClient, { name: 'test.eth' })
  })

  it('should use call with state override when forceUnexpired is true', async () => {
    mockCall.mockResolvedValue({ data: '0x' })
    mockClient.request.mockImplementation(mockCall)

    mockGetSupportedChainContractAddress.mockReturnValue(
      '0x9876543210987654321098765432109876543210',
    )

    const queryFn = getOwnerQueryFn(mockConfig)
    await queryFn({ queryKey: [{ name: 'test.eth', forceUnexpired: true }] })

    expect(mockCall).toHaveBeenCalledWith(mockConfig.getClient(), {
      stateOverride: [
        {
          address: '0x9876543210987654321098765432109876543210',
          code: '0x6004355f52600160205260405f20545f52600c60405f5e60205ff3',
        },
        {
          address: '0x9876543210987654321098765432109876543210',
          code: '0x6004355f52600560205260405f20545f52600c60405f5e60205ff3',
        },
      ],
    })

    expect(mockGetOwner.decode).toHaveBeenCalledWith(mockClient, '0x', { name: 'test.eth' })
  })

  it('should not use call with state override when forceUnexpired is false', async () => {
    mockGetOwner.mockResolvedValue({ owner: '0x1234567890123456789012345678901234567890' })

    const queryFn = getOwnerQueryFn(mockConfig)
    await queryFn({ queryKey: [{ name: 'test.eth', forceUnexpired: false }, 1] })

    expect(mockCall).not.toHaveBeenCalled()
    expect(mockGetOwner).toHaveBeenCalledWith(mockClient, { name: 'test.eth' })
  })
})
