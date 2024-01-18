import { hashQueryKey, QueryKey } from '@tanstack/react-query'
import { createContext, Dispatch, Reducer, useContext, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import { useHasSubgraphSyncErrors } from './useHasSubgraphSyncErrors'
import { useSubgraphMetaSync } from './useSubgraphMetaSync'

export type GlobalErrorState = {
  errors: {
    [hash: string]: {
      title?: string
      message?: string
      key: QueryKey
      type: 'NetworkLatencyError' | string
      priority?: number
    }
  }
  activeHashes: string[]
  meta: {
    hasSubgraphError: boolean
    hasIndexingErrors: boolean
    timestamp: number
    forceUpdate: boolean
  }
}

const GlobalErrorStateContext = createContext<GlobalErrorState>({
  errors: {},
  activeHashes: [],
  meta: {
    hasSubgraphError: false,
    hasIndexingErrors: false,
    timestamp: 0,
    forceUpdate: false,
  },
})

export const useGlobalErrorState = () => {
  const context = useContext(GlobalErrorStateContext)
  return context
}

type Action =
  | {
      type: 'SET_SUBGRAPH_ERROR'
      payload: {
        key: QueryKey
        title: string
        message: string
      }
    }
  | {
      type: 'SET_SUBGRAPH_LATENCY_ERROR'
      payload: {
        key: QueryKey
      }
    }
  | {
      type: 'SET_ERROR'
      payload: {
        key: QueryKey
        title: string
        message: string
        type: string
        priority?: number
      }
    }
  | {
      type: 'CLEAR_ERROR'
      payload: {
        key: QueryKey
      }
    }
  | {
      type: 'REGISTER_KEY'
      payload: {
        key: QueryKey
      }
    }
  | {
      type: 'UNREGISTER_KEY'
      payload: {
        key: QueryKey
      }
    }
  | {
      type: 'SET_META'
      payload: Partial<GlobalErrorState['meta']>
    }

export type GlobalErrorDispatch = Dispatch<Action>

const GlobalErrorDispatchContext = createContext<GlobalErrorDispatch>(() => {})

export const useGlobalErrorDispatch = () => {
  const context = useContext(GlobalErrorDispatchContext)
  return context
}

export const GlobalErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('common')
  const queryClient = useQueryClient()

  const reducer = (state: GlobalErrorState, action: Action) => {
    switch (action.type) {
      case 'SET_SUBGRAPH_ERROR': {
        const { key, title, message } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          errors: {
            ...state.errors,
            [hash]: {
              key,
              type: 'ENSJSSubgraphError',
              priority: 5,
              title,
              message,
            },
          },
          meta: {
            ...state.meta,
            hasSubgraphError: true,
          },
        }
      }
      case 'SET_SUBGRAPH_LATENCY_ERROR': {
        const { key } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          errors: {
            ...state.errors,
            [hash]: {
              key,
              type: 'ENSJSSubgraphLatency',
              priority: 5,
              title: t('errors.networkLatency.title'),
              message: t('errors.networkLatency.message'),
            },
          },
          meta: {
            ...state.meta,
            hasSubgraphError: true,
          },
        }
      }
      case 'SET_ERROR': {
        const { key, title, message, type, priority = 1 } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          errors: {
            ...state.errors,
            [hash]: {
              title,
              message,
              key,
              type,
              priority,
            },
          },
        }
      }
      case 'CLEAR_ERROR': {
        const { key } = action.payload
        const hash = hashQueryKey(key)
        const { [hash]: currentError, ...errors } = state.errors

        // Invalidate all queries with the same error type
        if (currentError) {
          const indexingErrors = Object.values(state.errors).filter(
            (error) => error.type === currentError.type,
          )
          for (const error of indexingErrors) {
            queryClient.invalidateQueries(error.key)
          }
        }

        const clearMeta =
          currentError?.type &&
          ['ENSJSSubgraphError', 'ENSJSUnknownError'].includes(currentError.type)

        return {
          ...state,
          errors,
          ...(clearMeta
            ? {
                meta: {
                  ...state.meta,
                  hasSubgraphError: false,
                  hasIndexingErrors: false,
                },
              }
            : {}),
        }
      }
      case 'REGISTER_KEY': {
        const { key } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          activeHashes: [...state.activeHashes.filter((h) => h !== hash), hash],
        }
      }
      case 'UNREGISTER_KEY': {
        const { key } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          activeHashes: state.activeHashes.filter((h) => h !== hash),
        }
      }
      case 'SET_META': {
        return {
          ...state,
          meta: {
            ...state.meta,
            ...action.payload,
          },
        }
      }
      default: {
        return state
      }
    }
  }
  const [state, dispatch] = useReducer<Reducer<GlobalErrorState, Action>>(reducer, {
    errors: {},
    activeHashes: [],
    meta: {
      hasSubgraphError: false,
      hasIndexingErrors: false,
      timestamp: 0,
      forceUpdate: false,
    },
  })

  useSubgraphMetaSync(state, dispatch)
  useHasSubgraphSyncErrors(state, dispatch)

  return (
    <GlobalErrorStateContext.Provider value={state}>
      <GlobalErrorDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalErrorDispatchContext.Provider>
    </GlobalErrorStateContext.Provider>
  )
}
