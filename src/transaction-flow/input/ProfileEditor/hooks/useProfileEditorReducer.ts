import { useReducer } from 'react'
import { match, P } from 'ts-pattern'

import type { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import type { useProfile } from '@app/hooks/useProfile'

type View =
  | 'loading'
  | 'migrateRegistry'
  | 'noResolver'
  | 'resolverNotNameWrapperAware'
  | 'editor'
  | 'upload'
  | 'nft'
  | 'addRecord'

type State = {
  flow: View[]
  currentIndex: number
}

type InitialData = {
  resolverStatus: ReturnType<typeof useResolverStatus>['data']
  profile: ReturnType<typeof useProfile>['data']
  isWrapped: boolean
  isLoading: boolean
}

const initializer =
  (deps: any) =>
  ({ profile, resolverStatus, isWrapped, isLoading }: InitialData): State => {
    const defaultState: State = {
      flow: ['loading'],
      currentIndex: 0,
    }

    console.log('initializer', profile, resolverStatus, isLoading)

    if (isLoading || !profile || !resolverStatus) return defaultState
    return match({
      profile,
      resolverStatus,
      isWrapped,
      isLoading,
    })
      .with(
        {
          profile: { isMigrated: false },
        },
        () => ({ ...defaultState, flow: ['migrateRegistry'] }),
      )
      .with({ resolverStatus: { hasResolver: false } }, () => ({
        ...defaultState,
        flow: ['noResolver'],
      }))
      .with({ resolverStatus: { isNameWrapperAware: false }, isWrapped: true }, () => ({
        ...defaultState,
        flow: ['resolverNotNameWrapperAware'],
      }))
      .with(
        { resolverStatus: { hasValidResolver: false } },
        {
          resolverStatus: { isAuthorized: false },
        },
        () => ({
          ...defaultState,
          flow: ['invalidResolver'],
        }),
      )
      .otherwise(() => ({
        ...defaultState,
        flow: ['editor'],
      }))
  }

type BaseAction = {
  type: 'init' | 'increment' | 'decrement' | 'appendViews'
  payload?: unknown
}

type InitAction = BaseAction & { type: 'init'; payload: InitialData }
type IncrementAction = BaseAction & { type: 'increment'; payload: never }
type DecrementAction = BaseAction & { type: 'decrement'; payload: never }
type AppendViewsAction = BaseAction & { type: 'appendViews'; payload: View[] }

type Action = InitAction | IncrementAction | DecrementAction | AppendViewsAction

const reducer = (deps: any) => (state: any, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'init':
      return initializer(deps)(payload)
    case 'increment':
      if (state.currentIndex >= state.flow.length - 1) return state
      return { ...state, currentIndex: state.currentIndex + 1 }
    case 'decrement':
      if (state.currentIndex <= 0) return state
      return { ...state, currentIndex: state.currentIndex - 1 }
    case 'appendViews':
      return { ...state, flow: [...state.flow, ...(payload as View[])] }
    default:
      return state
  }
}

export const useProfileEditorReducer = (initialState: InitialData, deps: {}) => {
  return useReducer(reducer(deps), initialState, initializer(deps))
}
