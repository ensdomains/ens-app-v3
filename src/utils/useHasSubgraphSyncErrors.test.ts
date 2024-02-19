import { renderHook } from '@app/test-utils'

import { hashQueryKey } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import * as wagmi from 'wagmi'

import { useHasSubgraphSyncErrors } from './useHasSubgraphSyncErrors'

const mockUseQueryClient = vi.spyOn(wagmi, 'useQueryClient')

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useSyncExternalStore: vi.fn().mockImplementation((subscribe, getSnapshot) => {
    subscribe(() => {})

    const initialState = getSnapshot()

    return initialState
  }),
}))

describe('useHasSubgraphSyncErrors', () => {
  it('it reports a subgraph error if it was found in query cache', async () => {
    mockUseQueryClient.mockImplementation((): any => {
      const event = {
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashQueryKey(['someKey', 'graph']),
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

    expect(result.current).toEqual({ error: 1, slow: 0 })
  })
  it('it reports a latency issue if a query took too long since render', async () => {
    vi.useFakeTimers()

    mockUseQueryClient.mockImplementation((): any => {
      let called = 0
      const event = {
        type: 'updated',
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashQueryKey(['someKey', 'graph']),
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

    expect(result.current).toEqual({ error: 0, slow: 1 })

    vi.clearAllTimers()
  })
})
