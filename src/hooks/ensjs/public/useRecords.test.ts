import { renderHook, waitFor } from '@app/test-utils'

import { Query, useQueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { getRecords } from '@ensdomains/ensjs/public'

import { createQueryKey, QueryKeyConfig, useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns } from '@app/types'

import { matchGetRecordsQueryKeyWithInternalParams, useRecords } from './useRecords'

describe('matchGetRecordsQueryKeyWithInternalParams', () => {
  it('matches for basic params', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test',
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(true)
  })
  it('matches for basic params with resolver', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
        resolver: { address: '0x123' },
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test',
        resolver: { address: '0x123' },
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(true)
  })
  it('matches for basic params with gatewayUrls', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
        gatewayUrls: ['test'] as string[],
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test',
        gatewayUrls: ['test'],
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(true)
  })
  it('does not match for mismatched params', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test2',
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(false)
  })
  it('does not match for mismatched resolver', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
        resolver: { address: '0x123' },
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test',
        resolver: { address: '0x124' },
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(false)
  })
  it('does not match for mismatched gatewayUrls', () => {
    const internalParams = {
      functionName: 'getRecords',
      functionParams: {
        name: 'test',
        gatewayUrls: ['test'] as string[],
      },
      address: '0x123',
      chainId: 1,
      scopeKey: undefined,
    } as const
    const matchKey = [
      {
        name: 'test',
        gatewayUrls: ['test2'],
      },
      1,
      '0x123',
      undefined,
      'getRecords',
    ]
    expect(
      matchGetRecordsQueryKeyWithInternalParams(internalParams)({
        queryKey: matchKey,
      } as unknown as Query),
    ).toBe(false)
  })
})

vi.mock('@app/hooks/useQueryOptions', async (importOriginal) => {
  const original = await importOriginal<object>()
  return {
    ...original,
    useQueryOptions: vi.fn(),
  }
})
vi.mock('@ensdomains/ensjs/public')

const mockGetRecords = vi.mocked(getRecords)

const mockUseQueryOptions = vi.mocked(useQueryOptions).mockImplementation(
  ({
    params,
    scopeKey,
    functionName,
    queryDependencyType,
    queryFn,
  }: QueryKeyConfig<{}, 'getRecords', 'standard'> & {
    queryFn: (config: ConfigWithEns) => unknown
  }) => {
    return {
      queryKey: createQueryKey({
        chainId: 1,
        address: '0x123',
        params,
        scopeKey,
        functionName,
        queryDependencyType,
      }),
      queryFn: queryFn({ getClient: vi.fn() } as unknown as ConfigWithEns),
    }
  },
)

const coinResult = {
  id: 60,
  name: 'eth',
  value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
} as const

const getRecordsResultWithCoin = {
  coins: [coinResult],
  resolverAddress: '0x1234',
} as const

const getRecordsResultWithCoinAndText = {
  ...getRecordsResultWithCoin,
  texts: [{ key: 'test', value: 'foo' }],
} as const

describe('useRecords', () => {
  it('returns undefined when no data is available', () => {
    const { result } = renderHook(() => useRecords({ name: 'test' }))
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
  })
  it('returns fresh data', async () => {
    mockGetRecords.mockResolvedValue(getRecordsResultWithCoin)
    const { result } = renderHook(() =>
      useRecords({ name: 'test', coins: ['eth'], keepPreviousData: true }),
    )
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    expect(result.current.data).toMatchObject(getRecordsResultWithCoin)
  })
  it('returns previous data when previous query is matching', async () => {
    mockGetRecords.mockResolvedValue(getRecordsResultWithCoin)
    const { result, rerender } = renderHook(
      ({ coins, texts }: { coins: string[]; texts?: string[] } = { coins: ['eth'] }) =>
        useRecords({ name: 'test', coins, texts, keepPreviousData: true }),
    )
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()
    rerender({ coins: ['eth'], texts: ['test'] })
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
    expect(result.current.data).toMatchObject(getRecordsResultWithCoin)
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false))
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('does not return previous data when keepPreviousData is not true', async () => {
    mockGetRecords.mockResolvedValue(getRecordsResultWithCoin)
    const { result, rerender } = renderHook(
      ({ coins, texts }: { coins: string[]; texts?: string[] } = { coins: ['eth'] }) =>
        useRecords({ name: 'test', coins, texts }),
    )
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()
    rerender({ coins: ['eth'], texts: ['test'] })
    expect(result.current.isPlaceholderData).toBe(false)
    expect(result.current.data).toBeUndefined()
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('returns previous data when matching getRecords cache entry exists', async () => {
    const { result: queryClientHook } = renderHook(() => useQueryClient())
    const queryClient = queryClientHook.current

    queryClient.setQueryData(
      createQueryKey({
        chainId: 1,
        address: '0x123',
        params: {
          name: 'test',
          coins: ['eth'],
        },
        scopeKey: undefined,
        functionName: 'getRecords',
        queryDependencyType: 'standard',
      }),
      getRecordsResultWithCoin,
    )

    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useRecords({ name: 'test', coins: ['eth'], texts: ['test'], keepPreviousData: true }),
    )
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
    expect(result.current.data).toMatchObject(getRecordsResultWithCoin)
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false))
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('returns previous data when matching getAddressRecord cache entry exists', async () => {
    const { result: queryClientHook } = renderHook(() => useQueryClient())
    const queryClient = queryClientHook.current

    queryClient.setQueryData(
      createQueryKey({
        chainId: 1,
        address: '0x123',
        params: {
          name: 'test',
        },
        scopeKey: undefined,
        functionName: 'getAddressRecord',
        queryDependencyType: 'standard',
      }),
      coinResult,
    )

    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useRecords({ name: 'test', coins: ['eth'], texts: ['test'], keepPreviousData: true }),
    )
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
    expect(result.current.data).toMatchObject({
      coins: [coinResult],
    })
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false))
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('does not return previous data when previous query is not matching', async () => {
    mockGetRecords.mockResolvedValue(getRecordsResultWithCoin)
    const { result, rerender } = renderHook(
      ({ name, texts }: { name: string; texts?: string[] } = { name: 'test' }) =>
        useRecords({ name, coins: ['eth'], texts, keepPreviousData: true }),
    )
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()
    rerender({ name: 'test1', texts: ['test'] })
    expect(result.current.isPlaceholderData).toBe(false)
    expect(result.current.data).toBeUndefined()
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('does not return previous data when mismatching getRecords cache entry exists', async () => {
    const { result: queryClientHook } = renderHook(() => useQueryClient())
    const queryClient = queryClientHook.current

    queryClient.setQueryData(
      createQueryKey({
        chainId: 1,
        address: '0x123',
        params: {
          name: 'test',
          coins: ['eth'],
        },
        scopeKey: undefined,
        functionName: 'getRecords',
        queryDependencyType: 'standard',
      }),
      getRecordsResultWithCoin,
    )

    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useRecords({ name: 'test1', coins: ['eth'], texts: ['test'], keepPreviousData: true }),
    )
    expect(result.current.isPlaceholderData).toBe(false)
    expect(result.current.data).toBeUndefined()
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
  it('does not return previous data when mismatching getAddressRecord cache entry exists', async () => {
    const { result: queryClientHook } = renderHook(() => useQueryClient())
    const queryClient = queryClientHook.current

    queryClient.setQueryData(
      createQueryKey({
        chainId: 1,
        address: '0x123',
        params: {
          name: 'test',
        },
        scopeKey: undefined,
        functionName: 'getAddressRecord',
        queryDependencyType: 'standard',
      }),
      coinResult,
    )

    mockGetRecords.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getRecordsResultWithCoinAndText
    })
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useRecords({ name: 'test1', coins: ['eth'], texts: ['test'], keepPreviousData: true }),
    )
    expect(result.current.isPlaceholderData).toBe(false)
    expect(result.current.data).toBeUndefined()
    vi.advanceTimersByTime(1000)
    await waitFor(() => expect(result.current.data).not.toBeUndefined())
    expect(result.current.data).toMatchObject(getRecordsResultWithCoinAndText)
  })
})
