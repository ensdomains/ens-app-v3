import { hashQueryKey, notifyManager, Query, QueryCache } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getBadQueries = (queryCache: QueryCache, renderedAt: number) => {
  const queries = queryCache.findAll([], { queryKey: ['graph'] }) // limit to subgraph queries
  const badQueries: Query[] = []

  queries.forEach((query) => {
    const { dataUpdatedAt } = query.state
    const elapsedTime = Date.now() - Math.max(dataUpdatedAt, renderedAt)

    if (
      (elapsedTime > SLOW_THRESHOLD &&
        query.state.status === 'loading' &&
        query.getObserversCount() > 0) ||
      query.state.status === 'error'
    ) {
      badQueries.push(query)
    }
  })

  return badQueries.length
}

const badQueriesHashKey = hashQueryKey(['badQueriesKeyPlaceholder'])

export const useSubgraphSyncError = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const renderedAt = useMemo(() => Date.now(), [])

  const badQueries = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        return queryCache.subscribe(({ query }) => {
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

  useEffect(() => {
    const stateError = state.errors[badQueriesHashKey]
    if (badQueries > 0 && !stateError) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          key: ['badQueriesKeyPlaceholder'],
          title: t('errors.networkLatency.title'),
          message: t('errors.networkLatency.message'),
          type: 'ENSJSSubgraphError',
          priority: 1,
        },
      })
    } else if (stateError) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['badQueriesKeyPlaceholder'],
        },
      })
    }
  }, [badQueries])
}
