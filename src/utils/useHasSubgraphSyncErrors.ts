'use client'

import { QueryCache } from '@tanstack/react-query'
import { useRef, useSyncExternalStore, type RefObject } from 'react'
import { useQueryClient } from 'wagmi'

type EventData = {
  [key: string]: {
    dataUpdateCount: number
    startTime: number
  }
}

const SLOW_THRESHOLD = 5000

const getBadQueries = (queryCache: QueryCache, eventData: RefObject<EventData>) => {
  const queries = queryCache.findAll([], {
    // only get subgraph queries that are pending or errored
    predicate: (query) => query.queryKey.at(-1) === 'graph' && query.state.status !== 'success',
  })
  const now = Date.now()

  return queries.reduce(
    (sum, query) => {
      // skip if query is not currently active
      if (query.getObserversCount() === 0) return sum

      const { queryHash } = query
      const isSlow =
        !!eventData.current?.[queryHash]?.startTime &&
        query.state.fetchStatus === 'fetching' &&
        now - eventData.current[queryHash].startTime > SLOW_THRESHOLD
      const isError = query.state.status === 'error'

      return {
        slow: sum.slow + (isSlow ? 1 : 0),
        error: sum.error + (isError ? 1 : 0),
      }
    },
    { slow: 0, error: 0 },
  )
}

export const useHasSubgraphSyncErrors = () => {
  const queryClient = useQueryClient()
  const queryData = useRef({ slow: 0, error: 0 })
  const eventData = useRef<EventData>({})

  return useSyncExternalStore(
    (onStoreChange) => {
      const queryCache = queryClient.getQueryCache()
      const unsubscribe = queryCache.subscribe((event) => {
        const lastKey = event.query.queryKey.at(-1)
        if (lastKey !== 'graph') return

        // Query is no longer active. Remove the query from the eventData. This
        if (event.type === 'observerRemoved' && event.query.getObserversCount() === 0) {
          delete eventData.current[event.query.queryHash]
          onStoreChange()
        }
        // Update store and records start time as a query has started fetching
        else if (
          event.type === 'updated' &&
          event.query.state.fetchStatus === 'fetching' &&
          eventData.current[event.query.queryHash]?.dataUpdateCount !==
            event.query.state.dataUpdateCount
        ) {
          eventData.current[event.query.queryHash] = {
            dataUpdateCount: event.query.state.dataUpdateCount,
            startTime: Date.now(),
          }
          onStoreChange()
          setTimeout(() => onStoreChange(), SLOW_THRESHOLD)
        }
        // Update store as an error has occurred
        else if (event.type === 'updated' && event.query.state.status === 'error') {
          onStoreChange()
        }
      })
      return () => {
        unsubscribe()
      }
    },
    () => {
      const newResult = getBadQueries(queryClient.getQueryCache(), eventData)
      if (
        newResult.slow !== queryData.current.slow ||
        newResult.error !== queryData.current.error
      ) {
        queryData.current = newResult
      }
      return queryData.current
    },
    () => {
      return queryData.current
    },
  )
}
