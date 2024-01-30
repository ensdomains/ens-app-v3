import { renderHook } from '@app/test-utils'

import { hashQueryKey } from '@tanstack/react-query'

import { useHasSubgraphSyncErrors } from './useHasSubgraphSyncErrors'

const useQueryClient = jest.fn()

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => useQueryClient(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useSyncExternalStore: jest.fn().mockImplementation((subscribe, getSnapshot) => {
    subscribe(() => {})

    const initialState = getSnapshot()

    return initialState
  }),
}))

describe('useHasSubgraphSyncErrors', () => {
  it('it reports a subgraph error if it was found in query cache', async () => {
    useQueryClient.mockImplementation(() => {
      const event = {
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashQueryKey(['someKey', 'graph']),
          state: {
            fetchStatus: 'fetching',
            status: 'error',
            fetchFailureReason: new DOMException(),
          },
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
    jest.useFakeTimers()

    useQueryClient.mockImplementation(() => {
      let called = 0
      const event = {
        query: {
          queryKey: ['someKey', 'graph'],
          queryHash: hashQueryKey(['someKey', 'graph']),
          state: {
            fetchStatus: 'fetching',
            status: 'loading',
            dataUpdateCount: called,
          },
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
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.now() + 5001)

    const { result } = renderHook(() => useHasSubgraphSyncErrors())

    expect(result.current).toEqual({ error: 0, slow: 1 })

    jest.clearAllTimers()
  })
})
