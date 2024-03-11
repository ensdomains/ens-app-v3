import { mockFunction, renderHook } from '@app/test-utils'

import { hashKey, useQueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { useHasSubgraphSyncErrors } from './useHasSubgraphSyncErrors'

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQueryClient: vi.fn(),
}))

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useSyncExternalStore: vi.fn().mockImplementation((subscribe, getSnapshot) => {
    subscribe(() => {})

    const initialState = getSnapshot()

    return initialState
  }),
}))

const mockUseQueryClient = mockFunction(useQueryClient)

describe('useHasSubgraphSyncErrors', () => {
  it('it reports a subgraph error if it was found in query cache', async () => {
    mockUseQueryClient.mockImplementation((): any => {
      const event = {
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashKey(['someKey', 'graph']),
          state: {
            fetchStatus: 'fetching',
            status: 'error',
            fetchFailureReason: new DOMException(),
          },
          getObserversCount: () => 1,
        },
      }

      const queryCache = {
        subscribe: (eventCallback: (event: { query: unknown }) => void) => {
          eventCallback(event)
          return () => {}
        },
        findAll: () => [event.query],
      }

      return {
        getQueryCache: () => queryCache,
      }
    })

    const { result } = renderHook(() => useHasSubgraphSyncErrors())

    expect(result.current).toEqual({ error: 1, slow: 0, isFetching: true })
  })
  it('it reports a latency issue if a query took too long since render', async () => {
    vi.useFakeTimers()

    mockUseQueryClient.mockImplementation((): any => {
      let called = 0
      const event = {
        type: 'updated',
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashKey(['someKey', 'graph']),
          state: {
            fetchStatus: 'fetching',
            status: 'loading',
            dataUpdateCount: called,
          },
          getObserversCount: () => 1,
        },
      }

      const queryCache = {
        subscribe: (eventCallback: (event: { query: unknown }) => void) => {
          eventCallback(event)
          return () => {}
        },
        findAll: () => [event.query],
      }

      return {
        getQueryCache: () => queryCache,
      }
    })
    // advance startTime of a query by 5 seconds
    vi.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.now() - 5001)

    const { result } = renderHook(() => useHasSubgraphSyncErrors())

    expect(result.current).toEqual({ error: 0, slow: 1, isFetching: true })

    vi.clearAllTimers()
  })
})
