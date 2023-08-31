import { QueryCache, notifyManager } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getSlowQueries = (queryCache: QueryCache) => {
  const queries = queryCache.getAll()
  const slowQueries: any[] = []

  queries.forEach((query) => {
    const elapsedTime = Date.now() - query.state.dataUpdatedAt

    if (elapsedTime > SLOW_THRESHOLD && query.state.status === 'loading') {
      slowQueries.push(query)
    }
  })

  return slowQueries
}

export const useHasSlowQueries = (_state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const slowQueries = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        return queryCache.subscribe(() => {
          notifyManager.batchCalls(onStoreChange)
          setTimeout(() => {
            notifyManager.batchCalls(onStoreChange)
          }, SLOW_THRESHOLD)
        })
      },
      [queryCache],
    ),
    () => getSlowQueries(queryCache),
    () => getSlowQueries(queryCache),
  )

  useEffect(() => {
    if (slowQueries.length > 0) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
          title: t('errors.networkLatency.title'),
          message: t('errors.networkLatency.message'),
          type: 'ENSJSNetworkLatencyError',
          priority: 1,
        },
      })
    } else {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    }
  }, [slowQueries])
}
