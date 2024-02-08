'use client'

import { QueryCache } from '@tanstack/react-query'
import { useRouter } from 'next/router'
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
      // TODO: Ask pavel why this is neccessary
      // const isFailedToFetch = query.state.fetchFailureReason instanceof DOMException

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
  const { events } = useRouter()
  const queryData = useRef({ slow: 0, error: 0 })
  const eventData = useRef<EventData>({})

  return useSyncExternalStore(
    (onStoreChange) => {
      const queryCache = queryClient.getQueryCache()
      const unsubscribe = queryCache.subscribe((event) => {
        const lastKey = event.query.queryKey.at(-1)
        if (lastKey !== 'graph') return
        if (
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
      })
      const resetData = () => {
        queryData.current = { slow: 0, error: 0 }
        eventData.current = {}
        onStoreChange()
      }
      events.on('routeChangeStart', resetData)
      return () => {
        unsubscribe()
        events.off('routeChangeStart', resetData)
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
