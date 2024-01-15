import { hashQueryKey, QueryCache } from '@tanstack/react-query'
import { useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'

const SLOW_THRESHOLD = 5000

const getSlowQueries = (queryCache: QueryCache) => {
  const graphQueries = queryCache.getAll().filter((query) => query.queryKey.includes('graph'))
  const slowQueries: any[] = []

  graphQueries.forEach((query) => {
    const elapsedTime = Date.now() - query.state.dataUpdatedAt

    if (
      elapsedTime > SLOW_THRESHOLD &&
      query.state.status === 'loading' &&
      query.getObserversCount() > 0
    ) {
      slowQueries.push(query)
    }
  })

  return slowQueries
}

export const useHasSlowQueries = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  // const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const slowQueryError = state.errors[hashQueryKey(['slowQueriesKeyPlaceholder'])]

  useEffect(() => {
    const unsubscribe = queryCache.subscribe(() => {
      const queries = getSlowQueries(queryCache)

      if (queries.length > 0 && !slowQueryError) {
        // console.log(queries)
        // dispatch({
        //   type: 'SET_ERROR',
        //   payload: {
        //     key: ['slowQueriesKeyPlaceholder'],
        //     title: t('errors.networkLatency.title'),
        //     message: t('errors.networkLatency.message'),
        //     type: 'ENSJSNetworkLatencyError',
        //     priority: 1,
        //   },
        // })
      }
    })
    return () => unsubscribe()
  }, [queryCache])

  useEffect(() => {
    if (slowQueryError) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    }
  }, [state.errors])
}
