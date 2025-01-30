import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { getBlock } from 'viem/actions'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount, useClient } from 'wagmi'

import { GetNameHistoryReturnType } from '@ensdomains/ensjs/subgraph'
import { encodeFuses } from '@ensdomains/ensjs/utils'

import { ClientWithEns } from '@app/types'

import { useNameHistory } from '../ensjs/subgraph/useNameHistory'
import {
  generateFuseSetBlocks,
  generateGetBlockQueryArray,
  generateMatchedFuseBlockData,
  getBlockQueryFn,
  useFusesSetDates,
} from './useFusesSetDates'

vi.mock('wagmi')
vi.mock('viem/actions')

vi.mock('../ensjs/subgraph/useNameHistory')

const mockUseAccount = mockFunction(useAccount).mockImplementation(() => ({ address: '0x123' }))
const mockUseClient = mockFunction(useClient)
const mockGetBlock = mockFunction(getBlock)

const mockUseNameHistory = mockFunction(useNameHistory)

describe('getBlockQueryFn', () => {
  it('calls getBlock with the correct parameters', async () => {
    const client = {} as ClientWithEns
    await getBlockQueryFn(client)({
      queryKey: [{ blockNumber: 1123n }] as any,
      meta: {},
      signal: undefined as any,
    })
    expect(mockGetBlock).toHaveBeenCalledWith(client, { blockNumber: 1123n })
  })
})

describe('generateFuseSetBlocks', () => {
  it('returns an empty object if no name history is provided', () => {
    const { blocksNeeded, fuseSetBlocks } = generateFuseSetBlocks(undefined)
    expect(blocksNeeded).toEqual(new Set())
    expect(fuseSetBlocks).toEqual([])
  })

  it('returns an empty object if no NameWrapped event is found in the name history', () => {
    const nameHistory = {
      domainEvents: [{ type: 'FusesSet', fuses: 0, blockNumber: 1234 }],
      registrationEvents: null,
      resolverEvents: null,
    } as GetNameHistoryReturnType
    const { blocksNeeded, fuseSetBlocks } = generateFuseSetBlocks(nameHistory)
    expect(blocksNeeded).toEqual(new Set())
    expect(fuseSetBlocks).toEqual([])
  })

  it('returns the correct blocks needed and fuse set blocks when given a name history with NameWrapped and FusesSet events', () => {
    const nameHistory = {
      domainEvents: [
        { type: 'NameWrapped', fuses: 0, blockNumber: 1230 },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
          blockNumber: 1231,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP', 'CANNOT_APPROVE'] } } }),
          blockNumber: 1232,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({
            input: { child: { named: ['CANNOT_CREATE_SUBDOMAIN', 'CANNOT_SET_RESOLVER'] } },
          }),
          blockNumber: 1234,
        },
      ],
      registrationEvents: null,
      resolverEvents: null,
    } as GetNameHistoryReturnType
    const { blocksNeeded, fuseSetBlocks } = generateFuseSetBlocks(nameHistory)
    expect(blocksNeeded).toEqual(new Set([1231n, 1232n, 1234n]))
    expect(fuseSetBlocks).toEqual([
      ['CANNOT_SET_RESOLVER', 1234],
      ['CANNOT_CREATE_SUBDOMAIN', 1234],
      ['CANNOT_UNWRAP', 1232],
      ['CANNOT_APPROVE', 1232],
      ['PARENT_CANNOT_CONTROL', 1231],
    ])
  })
  it('only uses the earliest FusesSet event for a single NameWrapped event if there are multiple', () => {
    const nameHistory = {
      domainEvents: [
        {
          type: 'NameWrapped',
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
          blockNumber: 1230,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1231,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1232,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1234,
        },
      ],
      registrationEvents: null,
      resolverEvents: null,
    } as GetNameHistoryReturnType
    const { blocksNeeded, fuseSetBlocks } = generateFuseSetBlocks(nameHistory)
    expect(blocksNeeded).toEqual(new Set([1230n, 1231n]))
    expect(fuseSetBlocks).toEqual([
      ['CANNOT_UNWRAP', 1231],
      ['PARENT_CANNOT_CONTROL', 1230],
    ])
  })
  it('only uses the latest NameWrapped event if there are multiple', () => {
    const nameHistory = {
      domainEvents: [
        {
          type: 'NameWrapped',
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
          blockNumber: 1230,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1231,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1232,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 1234,
        },
        {
          type: 'NameWrapped',
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
          blockNumber: 9000,
        },
        {
          type: 'FusesSet',
          fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
          blockNumber: 9001,
        },
      ],
      registrationEvents: null,
      resolverEvents: null,
    } as GetNameHistoryReturnType
    const { blocksNeeded, fuseSetBlocks } = generateFuseSetBlocks(nameHistory)
    expect(blocksNeeded).toEqual(new Set([9000n, 9001n]))
    expect(fuseSetBlocks).toEqual([
      ['CANNOT_UNWRAP', 9001],
      ['PARENT_CANNOT_CONTROL', 9000],
    ])
  })
})

describe('generateGetBlockQueryArray', () => {
  const client = {
    chain: {
      id: 1,
    },
  } as ClientWithEns

  it('returns an array of query objects with the correct block numbers', () => {
    const blockNumbers = [1123n, 1124n, 1125n]
    const queryArray = generateGetBlockQueryArray(client, {
      address: '0x123',
      blocksNeeded: new Set(blockNumbers),
    })
    expect(queryArray).toEqual([
      expect.objectContaining({
        queryKey: [{ blockNumber: 1123n }, 1, '0x123', undefined, 'getBlock'],
      }),
      expect.objectContaining({
        queryKey: [{ blockNumber: 1124n }, 1, '0x123', undefined, 'getBlock'],
      }),
      expect.objectContaining({
        queryKey: [{ blockNumber: 1125n }, 1, '0x123', undefined, 'getBlock'],
      }),
    ])
  })

  it('returns an empty array if no block numbers are provided', () => {
    const queryArray = generateGetBlockQueryArray(client, {
      address: '0x123',
      blocksNeeded: new Set(),
    })
    expect(queryArray).toEqual([])
  })
})

describe('generateMatchedFuseBlockData', () => {
  it('returns undefined data and no loading or fetching blocks if no fuse set blocks are provided', () => {
    const { data, hasPendingBlocks, hasFetchingBlocks } = generateMatchedFuseBlockData({
      fuseSetBlocks: [],
      blockDatas: [],
      queries: [],
    })
    expect(data).toBeUndefined()
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })

  it('returns undefined data and no loading or fetching blocks if no block datas are provided', () => {
    const { data, hasPendingBlocks, hasFetchingBlocks } = generateMatchedFuseBlockData({
      fuseSetBlocks: [['PARENT_CANNOT_CONTROL', 1234]],
      blockDatas: [],
      queries: [{ queryKey: [{ blockNumber: 1234n }] } as any],
    })
    expect(data).toBeUndefined()
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })

  it('returns undefined data and no loading or fetching blocks if no block data is found for a fuse set block', () => {
    const { data, hasPendingBlocks, hasFetchingBlocks } = generateMatchedFuseBlockData({
      fuseSetBlocks: [['PARENT_CANNOT_CONTROL', 1234]],
      blockDatas: [
        {
          data: undefined,
          isPending: false,
          isFetching: false,
        } as any,
      ],
      queries: [{ queryKey: [{ blockNumber: 1234n }] } as any],
    })
    expect(data).toBeUndefined()
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })

  it('returns the correct data and loading/fetching block flags when given a valid set of fuse set blocks and block datas', () => {
    const {
      data,
      hasPendingBlocks: hasPendingBlocks,
      hasFetchingBlocks,
    } = generateMatchedFuseBlockData({
      fuseSetBlocks: [
        ['PARENT_CANNOT_CONTROL', 1234],
        ['CANNOT_UNWRAP', 1234],
        ['CANNOT_APPROVE', 1234],
        ['CANNOT_BURN_FUSES', 1234],
      ],
      blockDatas: [
        {
          data: { number: 1234n, timestamp: 1627584000n },
          isPending: false,
          isFetching: false,
        } as any,
        {
          data: { number: 1233n, timestamp: 1627497600n },
          isPending: false,
          isFetching: false,
        } as any,
        {
          data: { number: 1232n, timestamp: 1627411200n },
          isPending: false,
          isFetching: false,
        } as any,
      ],
      queries: [
        { queryKey: [{ blockNumber: 1234n }] } as any,
        { queryKey: [{ blockNumber: 1233n }] } as any,
        { queryKey: [{ blockNumber: 1232n }] } as any,
      ],
    })
    expect(data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 29, 2021',
      CANNOT_UNWRAP: 'Jul 29, 2021',
      CANNOT_APPROVE: 'Jul 29, 2021',
      CANNOT_BURN_FUSES: 'Jul 29, 2021',
    })
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })

  it('returns the correct loading/fetching block flags when given a set of fuse set blocks and block datas with unused loading and fetching blocks', () => {
    const {
      data,
      hasPendingBlocks: hasPendingBlocks,
      hasFetchingBlocks,
    } = generateMatchedFuseBlockData({
      fuseSetBlocks: [
        ['PARENT_CANNOT_CONTROL', 1234],
        ['CANNOT_UNWRAP', 1234],
        ['CANNOT_APPROVE', 1234],
        ['CANNOT_BURN_FUSES', 1234],
      ],
      blockDatas: [
        {
          data: { number: 1234n, timestamp: 1627584000n },
          isPending: false,
          isFetching: false,
        } as any,
        {
          data: { number: 1233n, timestamp: 1627497600n },
          isPending: false,
          isFetching: true,
        } as any,
        {
          data: { number: 1232n, timestamp: 1627411200n },
          isPending: true,
          isFetching: false,
        } as any,
      ],
      queries: [
        { queryKey: [{ blockNumber: 1234n }] } as any,
        { queryKey: [{ blockNumber: 1233n }] } as any,
        { queryKey: [{ blockNumber: 1232n }] } as any,
      ],
    })
    expect(data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 29, 2021',
      CANNOT_UNWRAP: 'Jul 29, 2021',
      CANNOT_APPROVE: 'Jul 29, 2021',
      CANNOT_BURN_FUSES: 'Jul 29, 2021',
    })
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })
  it('returns the correct loading/fetching block flags when given a set of fuse set blocks and block datas with used loading and fetching blocks', () => {
    const {
      data,
      hasPendingBlocks: hasPendingBlocks,
      hasFetchingBlocks,
    } = generateMatchedFuseBlockData({
      fuseSetBlocks: [
        ['PARENT_CANNOT_CONTROL', 1234],
        ['CANNOT_UNWRAP', 1234],
        ['CANNOT_APPROVE', 1234],
        ['CANNOT_BURN_FUSES', 1234],
      ],
      blockDatas: [
        {
          data: { number: 1234n, timestamp: 1627584000n },
          isPending: true,
          isFetching: true,
        } as any,
      ],
      queries: [{ queryKey: [{ blockNumber: 1234n }] } as any],
    })
    expect(data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 29, 2021',
      CANNOT_UNWRAP: 'Jul 29, 2021',
      CANNOT_APPROVE: 'Jul 29, 2021',
      CANNOT_BURN_FUSES: 'Jul 29, 2021',
    })
    expect(hasPendingBlocks).toBe(true)
    expect(hasFetchingBlocks).toBe(true)
  })
  it('returns the correct data with multiple different block numbers', () => {
    const {
      data,
      hasPendingBlocks: hasPendingBlocks,
      hasFetchingBlocks,
    } = generateMatchedFuseBlockData({
      fuseSetBlocks: [
        ['PARENT_CANNOT_CONTROL', 1234],
        ['CANNOT_UNWRAP', 1233],
        ['CANNOT_APPROVE', 1232],
        ['CANNOT_BURN_FUSES', 1233],
      ],
      blockDatas: [
        {
          data: { number: 1234n, timestamp: 1627584000n },
          isPending: false,
          isFetching: false,
        } as any,
        {
          data: { number: 1233n, timestamp: 1627497600n },
          isPending: false,
          isFetching: false,
        } as any,
        {
          data: { number: 1232n, timestamp: 1627411200n },
          isPending: false,
          isFetching: false,
        } as any,
      ],
      queries: [
        { queryKey: [{ blockNumber: 1234n }] } as any,
        { queryKey: [{ blockNumber: 1233n }] } as any,
        { queryKey: [{ blockNumber: 1232n }] } as any,
      ],
    })
    expect(data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 29, 2021',
      CANNOT_UNWRAP: 'Jul 28, 2021',
      CANNOT_APPROVE: 'Jul 27, 2021',
      CANNOT_BURN_FUSES: 'Jul 28, 2021',
    })
    expect(hasPendingBlocks).toBe(false)
    expect(hasFetchingBlocks).toBe(false)
  })
})

describe('useFusesSetDates', () => {
  const timestamps = {
    '1234': 1627584000n,
    '1233': 1627497600n,
    '1232': 1627411200n,
  }
  const client = {
    chain: {
      id: 1,
    },
  }
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseClient.mockReturnValue(client)
    mockGetBlock.mockImplementation(async (_client, params) => {
      const { blockNumber } = params!
      return {
        number: blockNumber!,
        timestamp: timestamps[blockNumber!.toString(10) as keyof typeof timestamps],
      }
    })
  })
  it('returns correct data when empty', async () => {
    mockUseNameHistory.mockReturnValue({
      data: {
        domainEvents: [],
        registrationEvents: null,
        resolverEvents: null,
      },
      isSuccess: true,
    })
    const { result } = renderHook(() => useFusesSetDates({ name: 'test.eth' }))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBeUndefined()
  })
  it('returns correct data for a name with single fuse set event', async () => {
    mockUseNameHistory.mockReturnValue({
      data: {
        domainEvents: [
          {
            type: 'NameWrapped',
            fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
            blockNumber: 1232,
          },
        ],
        registrationEvents: null,
        resolverEvents: null,
      },
      isSuccess: true,
    })
    const { result } = renderHook(() => useFusesSetDates({ name: 'test.eth' }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 27, 2021',
    })
  })
  it('returns correct data for a name with multiple fuse set events', async () => {
    mockUseNameHistory.mockReturnValue({
      data: {
        domainEvents: [
          {
            type: 'NameWrapped',
            fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
            blockNumber: 1232,
          },
          {
            type: 'FusesSet',
            fuses: encodeFuses({ input: { child: { named: ['CANNOT_UNWRAP'] } } }),
            blockNumber: 1233,
          },
        ],
        registrationEvents: null,
        resolverEvents: null,
      },
      isSuccess: true,
    })
    const { result } = renderHook(() => useFusesSetDates({ name: 'test.eth' }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({
      PARENT_CANNOT_CONTROL: 'Jul 27, 2021',
      CANNOT_UNWRAP: 'Jul 28, 2021',
    })
  })
})
