import { QueryCache } from '@tanstack/react-query'

import { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'

const SLOW_THRESHOLD = 5000

const getSlowQueries = (queryCache: QueryCache) => {
  const queries = queryCache.getAll()
  const slowQueries: any[] = []

  queries.forEach((query) => {
    const elapsedTime = Date.now() - query.state.dataUpdatedAt

    if (
      elapsedTime > SLOW_THRESHOLD &&
      query.state.status === 'loading' &&
      query.getObserversCount() > 0
    ) {
      console.log(query)
      slowQueries.push(query)
    }
  })

  return slowQueries
}

export const useHasSlowQueries = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  return null
  // const { t } = useTranslation('common')

  // const queryClient = useQueryClient()
  // const queryCache = queryClient.getQueryCache()

  // const slowQueries = useSyncExternalStore(
  //   useCallback(
  //     (onStoreChange) => {
  //       return queryCache.subscribe(() => {
  //         notifyManager.batchCalls(onStoreChange)
  //         setTimeout(() => {
  //           notifyManager.batchCalls(onStoreChange)
  //         }, SLOW_THRESHOLD)
  //       })
  //     },
  //     [queryCache],
  //   ),
  //   () => getSlowQueries(queryCache),
  //   () => [],
  // )

  // useEffect(() => {
  //   const stateError = state.errors[hashQueryKey(['slowQueriesKeyPlaceholder'])]
  //   if (slowQueries.length > 0 && !stateError) {
  //     console.log('setting error')
  //     console.log(slowQueries)
  //     dispatch({
  //       type: 'SET_ERROR',
  //       payload: {
  //         key: ['slowQueriesKeyPlaceholder'],
  //         title: t('errors.networkLatency.title'),
  //         message: t('errors.networkLatency.message'),
  //         type: 'ENSJSNetworkLatencyError',
  //         priority: 1,
  //       },
  //     })
  //   } else if (stateError) {
  //     console.log('clearing error')
  //     dispatch({
  //       type: 'CLEAR_ERROR',
  //       payload: {
  //         key: ['slowQueriesKeyPlaceholder'],
  //       },
  //     })
  //   }
  // }, [slowQueries])
}
