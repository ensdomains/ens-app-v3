import { mockFunction, renderHook } from '@app/test-utils'

import { useProvider } from 'wagmi'

import { useGetHistory } from '../useGetHistory'
import { useGetFusesSetDates } from './useGetFusesSetDates'

jest.mock('../useGetHistory')

const mockUseProvider = mockFunction(useProvider)
const mockUseGetHistory = mockFunction(useGetHistory)

mockUseProvider.mockReturnValue({
  getBlock: (blockNumber: any) => new Date(blockNumber),
})

const mockHistory: any = {
  domain: [
    {
      type: 'NewOwner',
      blockNumber: 85,
      transactionHash: '0x31ec20daa6b92e3aa0d2e4f86178b72240e0e42fe7a0ce7f8371818b71f807d1',
      id: '85-1',
      data: {
        owner: '0xe6e340d132b5f46d1e472debcd681b2abc16e57e',
      },
    },
    {
      type: 'WrappedTransfer',
      blockNumber: 85,
      transactionHash: '0x31ec20daa6b92e3aa0d2e4f86178b72240e0e42fe7a0ce7f8371818b71f807d1',
      id: '85-3-0',
      data: {
        owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      },
    },
    {
      type: 'NameWrapped',
      blockNumber: 85,
      transactionHash: '0x31ec20daa6b92e3aa0d2e4f86178b72240e0e42fe7a0ce7f8371818b71f807d1',
      id: '85-4',
      data: {
        fuses: 196608,
        owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        expiryDate: '0',
      },
    },
    {
      type: 'NewResolver',
      blockNumber: 85,
      transactionHash: '0x31ec20daa6b92e3aa0d2e4f86178b72240e0e42fe7a0ce7f8371818b71f807d1',
      id: '85-5',
      data: {
        resolver: '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF',
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 90,
      transactionHash: '0xbdb27985e8f8437064c79e8f370e9eb2e3e5b3dd5abb1d7de686e5905a49a5d5',
      id: '90-0',
      data: {
        fuses: 196609,
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 91,
      transactionHash: '0xa12be5810f160bdbe307399751cad047078f874c1a04805a5a954486e3fc60e4',
      id: '91-0',
      data: {
        fuses: 196641,
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 92,
      transactionHash: '0xd8dc106156bf33f81e642816494e8191b6d3bb60ec0c1a14bab13a223db8e697',
      id: '92-0',
      data: {
        fuses: 196645,
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 93,
      transactionHash: '0x93305348b876b2a01265b626818a27e35813985ab0cba66ee2adaee911648378',
      id: '93-0',
      data: {
        fuses: 196661,
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 94,
      transactionHash: '0x0e3b450cbd6a12f76d690bbd2eb12d042c8585f6c1b2e2ec638b320679c2d3b4',
      id: '94-0',
      data: {
        fuses: 196669,
      },
    },
    {
      type: 'FusesSet',
      blockNumber: 95,
      transactionHash: '0x16e9453dfcf43d486c93381aaf6e9cf5da0b6826160b33b3fe3d40a86fa6f223',
      id: '95-0',
      data: {
        fuses: 196669,
      },
    },
  ],
  registration: [
    {
      type: 'NameRegistered',
      blockNumber: 85,
      transactionHash: '0x31ec20daa6b92e3aa0d2e4f86178b72240e0e42fe7a0ce7f8371818b71f807d1',
      id: '85-2',
      data: {
        registrant: '0xe6e340d132b5f46d1e472debcd681b2abc16e57e',
        expiryDate: '1705359805',
      },
    },
  ],
  resolver: [],
}

let count = 100
jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(() => {
  count -= 1
  return count.toString()
})

describe('useGetFusesSetDates', () => {
  it('should return an object with fuses mapped to strings', async () => {
    mockUseGetHistory.mockReturnValue({ history: mockHistory })

    const { result, waitForNextUpdate } = renderHook(() => useGetFusesSetDates('test.eth'))
    await waitForNextUpdate()
    expect(result.current).toEqual({
      fusesSetDates: {
        PARENT_CANNOT_CONTROL: '93',
        CANNOT_UNWRAP: '94',
        CANNOT_CREATE_SUBDOMAIN: '95',
        CANNOT_TRANSFER: '96',
        CANNOT_SET_TTL: '97',
        CANNOT_SET_RESOLVER: '98',
      },
    })
  })
})
