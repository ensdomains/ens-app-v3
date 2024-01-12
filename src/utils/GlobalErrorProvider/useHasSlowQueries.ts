import { hashQueryKey, notifyManager, Query, QueryCache } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getSlowQueries = (queryCache: QueryCache, renderedAt: number) => {
  const queries = queryCache.getAll()
  const slowQueries: Query[] = []

  queries.forEach((query) => {
    const { dataUpdatedAt } = query.state
    const elapsedTime = Date.now() - Math.max(dataUpdatedAt, renderedAt)

    if (
      elapsedTime > SLOW_THRESHOLD &&
      query.state.status === 'loading' &&
      query.getObserversCount() > 0
    ) {
      slowQueries.push(query)
    }
  })

  return slowQueries.length
}

const isSubgraphError = ({ state, queryKey }: Query) =>
  state.status === 'error' && queryKey.at(-1) === 'graph'

const slowQueriesHashKey = hashQueryKey(['slowQueriesKeyPlaceholder'])

export const useHasSlowQueries = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const renderedAt = useMemo(() => Date.now(), [])

  const slowQueries = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        return queryCache.subscribe(({ query }) => {
          if (isSubgraphError(query)) {
            dispatch({
              type: 'SET_SUBGRAPH_ERROR',
              payload: {
                key: ['subgraphErrorKeyPlaceholder'],
              },
            })
          }
          notifyManager.batchCalls(onStoreChange)
          setTimeout(() => {
            notifyManager.batchCalls(onStoreChange)
          }, SLOW_THRESHOLD)
        })
      },
      [queryCache],
    ),
    () => getSlowQueries(queryCache, renderedAt),
    () => getSlowQueries(queryCache, renderedAt),
  )

  useEffect(() => {
    const stateError = state.errors[slowQueriesHashKey]
    if (slowQueries > 0 && !stateError) {
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
    } else if (stateError) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    }
  }, [slowQueries])
}
