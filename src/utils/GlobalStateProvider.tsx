import { Dispatch, Reducer, createContext, useContext, useReducer } from 'react'
import { useTranslation } from 'react-i18next'

type GlobalState = {
  error?: {
    title: string
    message: string
  }
}

type GlobalStateDispatch = Dispatch<any>

const GlobalStateContext = createContext<GlobalState>({
  error: {
    title: 'Network Erro',
    message: 'Please check your internet connection and try again.',
  },
})

const GlobalStateDispatchContext = createContext<GlobalStateDispatch>(() => {})

type Action =
  | {
      type: 'SET_INDEXING_ERROR'
      payload: {
        timestamp?: number
      }
    }
  | {
      type: 'SET_NETWORK_ERROR'
    }
  | {
      type: 'SET_ERROR'
      payload: {
        title: string
        message: string
      }
    }
  | {
      type: 'CLEAR_ERROR'
    }

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('common')
  const reducer = (state: GlobalState, action: Action) => {
    switch (action.type) {
      case 'SET_INDEXING_ERROR': {
        const { timestamp } = action.payload
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
          error: {
            title: t('errors.indexingErrors.title'),
            message: t('errors.indexingErrors.message', {
              datetime,
              context: datetime ? 'datetime' : undefined,
            }),
          },
        }
      }
      case 'SET_NETWORK_ERROR': {
        return {
          ...state,
          error: {
            title: t('errors.networkError.title'),
            message: t('errors.networkError.message'),
          },
        }
      }
      case 'SET_ERROR': {
        return {
          ...state,
          error: {
            title: action.payload.title,
            message: action.payload.message,
          },
        }
      }
      default: {
        return state
      }
    }
  }
  const [state, dispatch] = useReducer<Reducer<GlobalState, Action>>(reducer, {})
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalStateDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalStateDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  return context
}

export const useGlobalStateDispatch = () => {
  const context = useContext(GlobalStateDispatchContext)
  return context
}
