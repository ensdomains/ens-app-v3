import { hashQueryKey, notifyManager, QueryCache } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getBadQueries = (queryCache: QueryCache, renderedAt: number) => {
  const queries = queryCache.findAll([], { predicate: (query) => query.queryKey.includes('graph') }) // limit to subgraph queries
  let slowQueries = 0
  let errorQueries = 0

  queries.forEach((query) => {
    const { dataUpdatedAt, status } = query.state
    const elapsedTime = Date.now() - Math.max(dataUpdatedAt, renderedAt)

    if (query.getObserversCount() > 0) {
      if (elapsedTime > SLOW_THRESHOLD && status === 'loading') {
        slowQueries += 1
      } else if (status === 'error') {
        errorQueries += 1
      }
    }
  })

  return `${slowQueries}:${errorQueries}`
}

const slowQueriesHashKey = hashQueryKey(['slowQueriesKeyPlaceholder'])
const errorQueriesHashKey = hashQueryKey(['errorQueriesKeyPlaceholder'])

export const useHasSubgraphSyncErrors = (
  state: GlobalErrorState,
  dispatch: GlobalErrorDispatch,
) => {
  const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const [renderedAt] = useState(() => Date.now())

  const badQueries = useSyncExternalStore(
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
    () => getBadQueries(queryCache, renderedAt),
    () => getBadQueries(queryCache, renderedAt),
  )

  const [slow, errors] = badQueries.split(':').map((x) => parseInt(x))

  useEffect(() => {
    const slowError = state.errors[slowQueriesHashKey]
    if (!slowError && slow > 0) {
      dispatch({
        type: 'SET_SUBGRAPH_LATENCY_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    } else if (slowError) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slow])

  useEffect(() => {
    const queryError = state.errors[errorQueriesHashKey]
    if (!queryError && errors > 0) {
      dispatch({
        type: 'SET_SUBGRAPH_ERROR',
        payload: {
          key: ['errorQueriesKeyPlaceholder'],
          title: t('errors.networkError.title'),
          message: t('errors.networkError.message'),
        },
      })
    } else if (queryError) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['errorQueriesKeyPlaceholder'],
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])
}
