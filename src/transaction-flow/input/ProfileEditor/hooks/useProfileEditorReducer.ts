import { useReducer } from 'react'
import { match } from 'ts-pattern'

import type { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import type { useProfile } from '@app/hooks/useProfile'

export type View =
  | 'loading'
  | 'migrateRegistry'
  | 'noResolver'
  | 'resolverNotNameWrapperAware'
  | 'editor'
  | 'upload'
  | 'nft'
  | 'addRecord'
  | 'resolverOutOfDate'
  | 'transferOrResetProfile'
  | 'invalidResolver'
  | 'migrateProfileSelector'
  | 'migrateProfileWarning'
  | 'resetProfile'
  | 'updateResolverOrResetProfile'

type State = {
  stack: View[]
}

type Dependencies = {
  onDismiss?: () => void
}

type InitialData = {
  resolverStatus: ReturnType<typeof useResolverStatus>['data']
  profile: ReturnType<typeof useProfile>['data']
  isWrapped: boolean
  isLoading: boolean
}

const initializer = ({ profile, resolverStatus, isWrapped, isLoading }: InitialData): State => {
  const defaultState: State = {
    stack: ['loading'] as const,
  }

  if (isLoading || !profile || !resolverStatus) return defaultState
  return (
    match({
      profile,
      resolverStatus,
      isWrapped,
      isLoading,
    })
      .with(
        {
          profile: { isMigrated: false },
        },
        () => ({ ...defaultState, stack: ['migrateRegistry'] as View[] }),
      )
      .with({ resolverStatus: { hasResolver: false } }, () => ({
        ...defaultState,
        stack: ['noResolver'] as View[],
      }))
      // NOTE: isAuthorized is used as backup check in case the resolver is name wrapper aware but not a known resolver (custom resolver)
      .with(
        { resolverStatus: { isNameWrapperAware: false, isAuthorized: false }, isWrapped: true },
        () => ({
          ...defaultState,
          stack: ['resolverNotNameWrapperAware'] as View[],
        }),
      )
      .with({ resolverStatus: { isOutdatedResolver: true } }, () => ({
        ...defaultState,
        stack: ['resolverOutOfDate'] as View[],
      }))
      .with(
        { resolverStatus: { hasValidResolver: false } },
        {
          resolverStatus: { isAuthorized: false },
        },
        () => ({
          ...defaultState,
          stack: ['invalidResolver'] as View[],
        }),
      )
      .otherwise(() => ({
        ...defaultState,
        stack: ['editor'] as View[],
      }))
  )
}

type BaseAction = {
  type: 'init' | 'increment' | 'decrement' | 'pushView' | 'popView'
  payload?: unknown
}

type InitAction = BaseAction & { type: 'init'; payload: InitialData }
type IncrementAction = BaseAction & { type: 'pushView'; payload: View }
type DecrementAction = BaseAction & { type: 'popView'; payload?: never }

type Action = InitAction | IncrementAction | DecrementAction

const reducer =
  ({ onDismiss }: Dependencies) =>
  (state: State, action: Action) => {
    const { type, payload } = action
    switch (type) {
      case 'init':
        return initializer(payload)
      case 'pushView':
        return { ...state, stack: [...state.stack, payload] }
      case 'popView': {
        const poopedStack = state.stack.slice(0, -1)
        if (poopedStack.length > 0) return { ...state, stack: poopedStack }
        onDismiss?.()
        return state
      }
      default:
        return state
    }
  }

export const useProfileEditorReducer = (initialState: InitialData, deps: Dependencies) => {
  return useReducer(reducer(deps), initialState, initializer)
}
