import { useCallback } from 'react'

import {
  useGlobalErrorDispatch,
  useGlobalErrorState,
} from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

export const useGlobalError = () => {
  const state = useGlobalErrorState()
  const dispatch = useGlobalErrorDispatch()

  const resetMeta = useCallback(() => {
    if (state.meta.hasIndexingErrors || state.meta.hasSubgraphError || state.meta.timestamp)
      dispatch({
        type: 'SET_META',
        payload: {
          hasSubgraphError: false,
          hasIndexingErrors: false,
          timestamp: 0,
        },
      })
  }, [state, dispatch])

  const setMetaError = useCallback(() => {
    if (!state.meta.hasSubgraphError)
      dispatch({
        type: 'SET_META_ERROR',
        payload: {
          hasSubgraphError: true,
        },
      })
  }, [state, dispatch])
  return {
    resetMeta,
    setMetaError,
  }
}
