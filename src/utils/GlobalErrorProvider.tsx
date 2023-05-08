import { QueryKey, hashQueryKey } from '@tanstack/react-query'
import { Dispatch, Reducer, createContext, useContext, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import { ENSJSErrorName } from '@ensdomains/ensjs/utils/errors'

type GlobalErrorState = {
  errors: {
    [hash: string]: {
      title: string
      message: string
      key: QueryKey
      type: ENSJSErrorName | 'NetworkLatencyError' | string
      priority?: number
    }
  }
  activeHashes: string[]
}

type GlobalErrorDispatch = Dispatch<any>

const GlobalErrorStateContext = createContext<GlobalErrorState>({
  errors: {},
  activeHashes: [],
})

const GlobalErrorDispatchContext = createContext<GlobalErrorDispatch>(() => {})

type Action =
  | {
      type: 'SET_INDEXING_ERROR'
      payload: {
        key: QueryKey
        timestamp?: number
      }
    }
  | {
      type: 'SET_NETWORK_ERROR'
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

export const GlobalErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('common')
  const queryClient = useQueryClient()

  const reducer = (state: GlobalErrorState, action: Action) => {
    switch (action.type) {
      case 'SET_INDEXING_ERROR': {
        const { timestamp, key } = action.payload
        const hash = hashQueryKey(key)
        const datetime = timestamp
          ? new Date(timestamp * 1000).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })
          : undefined
        return {
          ...state,
          errors: {
            ...state.errors,
            [hash]: {
              title: t('errors.indexingErrors.title'),
              message: t('errors.indexingErrors.message', {
                datetime,
                context: datetime ? 'datetime' : undefined,
              }),
              key,
              type: 'ENSJSSubgraphIndexingError',
              priority: 5,
            },
          },
        }
      }
      case 'SET_NETWORK_ERROR': {
        const { key } = action.payload
        const hash = hashQueryKey(key)
        return {
          ...state,
          errors: {
            ...state.errors,
            [hash]: {
              title: t('errors.networkError.title'),
              message: t('errors.networkError.message'),
              key,
              type: 'ENSJSUnknownError',
              priority: 5,
            },
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

        return {
          ...state,
          errors,
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
      default: {
        return state
      }
    }
  }
  const [state, dispatch] = useReducer<Reducer<GlobalErrorState, Action>>(reducer, {
    errors: {},
    activeHashes: [],
  })

  return (
    <GlobalErrorStateContext.Provider value={state}>
      <GlobalErrorDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalErrorDispatchContext.Provider>
    </GlobalErrorStateContext.Provider>
  )
}

export const useGlobalErrorState = () => {
  const context = useContext(GlobalErrorStateContext)
  return context
}

export const useGlobalErrorDispatch = () => {
  const context = useContext(GlobalErrorDispatchContext)
  return context
}
