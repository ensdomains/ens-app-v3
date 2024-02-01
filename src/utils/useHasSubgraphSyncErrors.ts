'use client'

import { QueryCache } from '@tanstack/react-query'
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { useQueryClient } from 'wagmi'

type EventData = {
  [key: string]: {
    dataUpdateCount: number
    startTime: number
  }
}

const SLOW_THRESHOLD = 5000

const getBadQueries = (
  queryCache: QueryCache,
  eventData: RefObject<EventData>,
  renderedAt: number,
) => {
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
      eventData.current[queryHash].startTime - renderedAt > SLOW_THRESHOLD

    const isError = query.state.status === 'error'
    const isFailedToFetch = query.state.fetchFailureReason instanceof DOMException

    if (isError) {
      if (isFailedToFetch) errorQueries += 1
      else query.invalidate()
    } else if (isSlow) {
      slowQueries += 1
    }
  })

  return { slow: slowQueries, error: errorQueries }
}

export const useHasSubgraphSyncErrors = () => {
  const queryClient = useQueryClient()
  const queryData = useRef({ slow: 0, error: 0 })
  const eventData = useRef<EventData>({})

  const [renderedAt, setRenderedAt] = useState(0)

  useEffect(() => {
    setRenderedAt(Date.now())
  }, [])

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
      const newResult = getBadQueries(queryClient.getQueryCache(), eventData, renderedAt)
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
