import { uniq } from 'lodash'
import { useCallback } from 'react'

import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'

import { useChainName } from './chain/useChainName'
import { useLocalStorageReducer } from './useLocalStorage'

type ReducerData = {
  capturedEvents: string[]
  payment: Omit<PlausibleProps, 'referrer' | 'keyword' | 'tld'>
  chainName: string
}
type ReducerAction =
  | {
      name: 'updatePayment'
      payload: {
        [K in keyof ReducerData['payment']]: K extends keyof PlausibleProps
          ? PlausibleProps[K]
          : never
      }
    }
  | {
      name: 'trackEvent'
      payload: { type: PlausibleType; props?: PlausibleProps }
    }

function makeDefaultState(chainName: string) {
  return {
    capturedEvents: [],
    payment: {},
    chainName,
  }
}

const reducer = (state: ReducerData, action: ReducerAction) => {
  switch (action.name) {
    case 'updatePayment': {
      const newPayment = { ...state.payment, ...action.payload }
      console.log('newPayment', newPayment)

      return {
        ...state,
        capturedEvents: uniq([...state.capturedEvents, 'Payment selected']),
        payment: newPayment,
      }
    }
    case 'trackEvent': {
      const { type, props } = action.payload
      trackEvent(type, state.chainName, props)

      return {
        ...state,
        capturedEvents: uniq([...state.capturedEvents, action.payload.type]),
      }
    }
    default:
      return state
  }
}

export const useRegistrationTrackingReducer = () => {
  const chainName = useChainName()
  const [state, dispatch] = useLocalStorageReducer<ReducerData, ReducerAction>(
    'registration-tracking',
    reducer,
    makeDefaultState(chainName),
  )

  const captureEvent = useCallback(
    (type: PlausibleType, props?: PlausibleProps) => {
      if (type === 'Home page' && state.capturedEvents.includes('Home page')) {
        return
      }

      dispatch({ name: 'trackEvent', payload: { type, props } })
    },
    [dispatch, state.capturedEvents],
  )

  return {
    dispatch,
    captureRegistrationEvent: captureEvent,
  }
}
