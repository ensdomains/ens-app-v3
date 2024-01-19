'use client'

import { QueryCache } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
// import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getBadQueries = (queryCache: QueryCache, eventData: any) => {
  console.log('GET BAD QUERIES')
  console.log('EVENT DATA', eventData.current)
  const queries = queryCache.findAll([], {
    predicate: (query) => {
      const lastKey = query.queryKey[query.queryKey.length - 1]
      return lastKey === 'graph'
    },
  }) // limit to subgraph queries
  let slowQueries = 0
  let errorQueries = 0

  queries.forEach((query) => {
    const { queryHash } = query
    const isSlow =
      !!eventData.current?.[queryHash]?.startTime &&
      (query.state.status === 'loading' || query.state.fetchStatus === 'fetching') &&
      eventData.current[queryHash].startTime + SLOW_THRESHOLD < Date.now()
    const isError = query.state.status === 'error'

    if (isSlow) slowQueries += 1
    if (isError) errorQueries += 1
  })

  return { slow: slowQueries, error: errorQueries }
}

// const slowQueriesHashKey = hashQueryKey(['slowQueriesKeyPlaceholder'])
// const errorQueriesHashKey = hashQueryKey(['errorQueriesKeyPlaceholder'])

export const useHasSubgraphSyncErrors = (
  state: GlobalErrorState,
  dispatch: GlobalErrorDispatch,
) => {
  // this is just here to avoid the linter complaining about unused variables
  console.log(state, dispatch)
  // const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  // const [renderedAt] = useState(() => Date.now())

  useEffect(() => {
    console.log('NEW QUERY CLIENT!!!!!!!')
  }, [queryClient])

  // Using ref to check
  const queryData = useRef({ slow: 0, error: 0 })
  const eventData = useRef<{
    [key: string]: {
      dataUpdateCount: number
      startTime: number
    }
  }>({})

  return useSyncExternalStore(
    (onStoreChange) => {
      console.log('SUBSCRIBE')
      const queryCache = queryClient.getQueryCache()
      const unsubscribe = queryCache.subscribe((event) => {
        const lastKey = event.query.queryKey[event.query.queryKey.length - 1]
        if (lastKey !== 'graph') return
        console.log(
          'EVENT',
          event.query.queryHash,
          { ...event.query.initialState },
          { ...event.query.state },
        )
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
          console.log('>>>>>> ON STORE CHANGE')
          onStoreChange()
          // Not sure if this actually works
          setTimeout(() => onStoreChange(), SLOW_THRESHOLD)
        }
      })
      return () => {
        console.log('UNSUBSCRIBE')
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
      // return an object with a ref if there is no change to avoid infinite loop
      return queryData.current
    },
    () => {
      // return an object with a ref to avoid infinite loop
      return queryData.current
    },
  )

  // useEffect(() => {
  //   console.log('badQueries >', badQueries, '<')
  // }, [])

  // const { slow, errors } = { slow: 0, errors: 0 }
  // // const [slow, errors] = badQueries.split(':').map((x) => parseInt(x))

  // useEffect(() => {
  //   const slowError = state.errors[slowQueriesHashKey]
  //   if (!slowError && slow > 0) {
  //     dispatch({
  //       type: 'SET_SUBGRAPH_LATENCY_ERROR',
  //       payload: {
  //         key: ['slowQueriesKeyPlaceholder'],
  //       },
  //     })
  //   } else if (slowError) {
  //     dispatch({
  //       type: 'CLEAR_ERROR',
  //       payload: {
  //         key: ['slowQueriesKeyPlaceholder'],
  //       },
  //     })
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // useEffect(() => {
  //   const queryError = state.errors[errorQueriesHashKey]
  //   if (!queryError && errors > 0) {
  //     dispatch({
  //       type: 'SET_SUBGRAPH_ERROR',
  //       payload: {
  //         key: ['errorQueriesKeyPlaceholder'],
  //         title: t('errors.networkError.title'),
  //         message: t('errors.networkError.message'),
  //       },
  //     })
  //   } else if (queryError) {
  //     dispatch({
  //       type: 'CLEAR_ERROR',
  //       payload: {
  //         key: ['errorQueriesKeyPlaceholder'],
  //       },
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
}
