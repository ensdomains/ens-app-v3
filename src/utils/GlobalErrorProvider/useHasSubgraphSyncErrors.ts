'use client'

import { QueryCache } from '@tanstack/react-query'
import { RefObject, useRef } from 'react'
import { useQueryClient } from 'wagmi'

import { useSyncExternalStore } from './useSyncExternalStore'

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
  let slowQueries = 0
  let errorQueries = 0

  queries.forEach((query) => {
    const { queryHash } = query
    const isSlow =
      !!eventData.current?.[queryHash]?.startTime &&
      (query.state.status === 'loading' || query.state.fetchStatus === 'fetching') &&
      eventData.current[queryHash].startTime + SLOW_THRESHOLD < Date.now()
    const isError = query.state.status === 'error'

    if (isError) {
      // invalidate query with error which has data, when subgraph goes back online data shows up
      if (!query.state.isInvalidated && query.state.dataUpdateCount > 1) query.invalidate()
      else errorQueries += 1
    } else if (isSlow) slowQueries += 1
  })

  return { slow: slowQueries, error: errorQueries }
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
        if (
          event.query.state.fetchStatus === 'fetching' ||
          event.query.state.status === 'loading'
        ) {
          if (
            eventData.current[event.query.queryHash]?.dataUpdateCount ===
            event.query.state.dataUpdateCount
          )
            return
          eventData.current[event.query.queryHash] = {
            dataUpdateCount: event.query.state.dataUpdateCount,
            startTime: Date.now(),
          }
          onStoreChange()
          setTimeout(() => onStoreChange(), SLOW_THRESHOLD)
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
