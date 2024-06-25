import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { beforeEach, expect, it, vi } from 'vitest'

import { evmChainIdToCoinType } from '@ensdomains/address-encoder/utils'
import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import { GetSubgraphRecordsReturnType } from '@ensdomains/ensjs/subgraph'

import { createDateAndValue } from '@app/utils/utils'

import { useRecords } from './ensjs/public/useRecords'
import { useDecodedName } from './ensjs/subgraph/useDecodedName'
import { useSubgraphRecords } from './ensjs/subgraph/useSubgraphRecords'
import { useProfile } from './useProfile'

vi.mock('./ensjs/subgraph/useSubgraphRecords')
vi.mock('./ensjs/public/useRecords')
vi.mock('./ensjs/subgraph/useDecodedName')

const mockUseSubgraphRecords = mockFunction(useSubgraphRecords)
const mockUseRecords = mockFunction(useRecords)
const mockUseDecodedName = mockFunction(useDecodedName)

const mockUseSubgraphRecordsData: GetSubgraphRecordsReturnType = {
  coins: ['0', '60', '61'],
  texts: ['avatar', 'description', 'url', 'com.example'],
  createdAt: createDateAndValue(new Date('2021-01-01').getTime()),
  isMigrated: true,
}

const mockUseRecordsData: GetRecordsReturnType = {
  abi: null,
  contentHash: null,
  texts: [
    {
      key: 'avatar',
      value: 'avatar-value',
    },
    {
      key: 'description',
      value: 'description-value',
    },
    {
      key: 'url',
      value: 'url-value',
    },
    {
      key: 'com.example',
      value: 'com.example-value',
    },
  ],
  coins: [
    {
      id: 0,
      name: 'btc',
      value: 'BTC-value',
    },
    {
      id: 60,
      name: 'eth',
      value: 'ETH-value',
    },
    {
      id: 61,
      name: 'etc',
      value: 'ETC-value',
    },
  ],
  resolverAddress: '0xresolverAddress',
}

beforeEach(() => {
  vi.resetAllMocks()
  mockUseSubgraphRecords.mockReturnValue({
    data: mockUseSubgraphRecordsData,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  mockUseRecords.mockReturnValue({
    data: mockUseRecordsData,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
    isPlaceholderData: false,
  })
  mockUseDecodedName.mockReturnValue({
    data: undefined,
  })
})

it('should return the correct data', () => {
  const { result } = renderHook(() => useProfile({ name: 'test.eth' }))
  expect(result.current).toMatchInlineSnapshot(`
    {
      "data": {
        "abi": null,
        "address": "ETH-value",
        "coins": [
          {
            "id": 0,
            "name": "btc",
            "value": "BTC-value",
          },
          {
            "id": 60,
            "name": "eth",
            "value": "ETH-value",
          },
          {
            "id": 61,
            "name": "etc",
            "value": "ETC-value",
          },
        ],
        "contentHash": null,
        "createdAt": {
          "date": 2021-01-01T00:00:00.000Z,
          "value": 1609459200000,
        },
        "isMigrated": true,
        "resolverAddress": "0xresolverAddress",
        "texts": [
          {
            "key": "avatar",
            "value": "avatar-value",
          },
          {
            "key": "description",
            "value": "description-value",
          },
          {
            "key": "url",
            "value": "url-value",
          },
          {
            "key": "com.example",
            "value": "com.example-value",
          },
        ],
      },
      "isCachedData": false,
      "isFetching": false,
      "isLoading": false,
      "refetchIfEnabled": [Function],
    }
  `)
})

it('should set address value to ETH record value', () => {
  const { result } = renderHook(() => useProfile({ name: 'test.eth' }))
  expect(result.current.data!.address).toEqual('ETH-value')
})

it('should set address value to undefined if no ETH record value', () => {
  mockUseRecords.mockReturnValue({
    data: {
      ...mockUseRecordsData,
      coins: mockUseRecordsData.coins.filter((x) => x.id !== 60),
    } as GetRecordsReturnType,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  const { result } = renderHook(() => useProfile({ name: 'test.eth' }))
  expect(result.current.data!.address).toEqual(undefined)
})

it('should add decodedName if available', () => {
  mockUseDecodedName.mockReturnValue({
    data: 'decoded-name',
  })
  const { result } = renderHook(() => useProfile({ name: 'test.eth' }))
  expect(result.current.data!.decodedName).toEqual('decoded-name')
})

it('should fetch default records when no subgraph records, then fetch with subgraph records once available', async () => {
  mockUseSubgraphRecords.mockReturnValue({
    data: undefined,
    isLoading: true,
    isFetching: false,
    isCachedData: false,
  })
  mockUseRecords.mockReturnValue({
    data: {
      ...mockUseRecordsData,
      // avatar and com.example are not default records
      texts: mockUseRecordsData.texts.filter((x) => x.key !== 'com.example' && x.key !== 'avatar'),
    } as GetRecordsReturnType,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  const { result, rerender } = renderHook(() => useProfile({ name: 'test.eth' }))
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      texts: expect.not.arrayContaining(['avatar', 'com.example']),
    }),
  )
  expect(result.current.data!.texts).toHaveLength(2)

  mockUseSubgraphRecords.mockReturnValue({
    data: mockUseSubgraphRecordsData,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  mockUseRecords.mockReset()
  mockUseRecords.mockReturnValue({
    data: mockUseRecordsData,
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  rerender()
  await waitFor(() => !result.current.isLoading)
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      texts: expect.arrayContaining(['avatar', 'com.example']),
    }),
  )
  expect(result.current.data!.texts).toHaveLength(4)
})

it('should fetch union of supported coin records and subgraph coin records', () => {
  mockUseSubgraphRecords.mockReturnValue({
    data: {
      ...mockUseSubgraphRecordsData,
      coins: [/* ATOM */ '118', /* XMR */ '128'],
    },
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  renderHook(() => useProfile({ name: 'test.eth' }))
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      coins: expect.arrayContaining([
        /* some default coins */ 0,
        60,
        501,
        evmChainIdToCoinType(10),
        /* subgraph coins */ 118,
        128,
      ]),
    }),
  )
})

it('should filter out unsupported coin records', () => {
  mockUseSubgraphRecords.mockReturnValue({
    data: {
      ...mockUseSubgraphRecordsData,
      coins: ['3010'],
    },
    isLoading: false,
    isFetching: false,
    isCachedData: false,
  })
  renderHook(() => useProfile({ name: 'test.eth' }))
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      coins: expect.not.arrayContaining([3010]),
    }),
  )
})

it('should propagate resolverAddress parameter to useSubgraphRecords and useRecords', () => {
  renderHook(() => useProfile({ name: 'test.eth', resolverAddress: '0xresolverAddress' }))
  expect(useSubgraphRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      resolverAddress: '0xresolverAddress',
    }),
  )
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      resolver: {
        address: '0xresolverAddress',
        fallbackOnly: false,
      },
    }),
  )
})

it('should propagate subgraphEnabled parameter to useSubgraphRecords', () => {
  renderHook(() => useProfile({ name: 'test.eth', subgraphEnabled: false }))
  expect(useSubgraphRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      enabled: false,
    }),
  )
})

it('should propagate enabled parameter to useSubgraphRecords and useRecords', () => {
  renderHook(() => useProfile({ name: 'test.eth', enabled: false }))
  expect(useSubgraphRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      enabled: false,
    }),
  )
  expect(useRecords).toHaveBeenCalledWith(
    expect.objectContaining({
      enabled: false,
    }),
  )
})
