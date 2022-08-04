import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Reducer, useImmerReducer } from 'use-immer'

const isSSR = !!(typeof window !== 'undefined' && window.document && window.document.createElement)

const getStorageValue = <D>(key: string, defaultValue: D) => {
  // getting stored value
  const saved = isSSR && localStorage.getItem(key)
  return saved ? JSON.parse(saved) : defaultValue
}

export const useLocalStorage = <D>(key: string, defaultValue: D): [D, Dispatch<SetStateAction<D>>] => {
  const [value, setValue] = useState<D>(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    if (value !== defaultValue) {
      localStorage.setItem(key, JSON.stringify(value))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value])

  return [value, setValue]
}

export const useLocalStorageReducer = <S = any, A = any>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction?: ((initial: any) => any) | undefined,
): [S, Dispatch<A>] => {
  const [state, dispatch] = useImmerReducer(reducer, getStorageValue(key, initialState), initialAction)

  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem(key, JSON.stringify(state))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, state])

  return [state, dispatch]
}
