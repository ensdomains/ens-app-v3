import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useEvent } from 'react-use'
import { Reducer, useImmerReducer } from 'use-immer'

import { parse, stringify } from '@app/utils/query/persist'

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const getStorageValue = <D>(key: string, defaultValue: D): D => {
  // getting stored value
  const saved = isBrowser && localStorage.getItem(key)

  try {
    return saved && saved !== 'undefined' ? parse(saved) : defaultValue
  } catch (e) {
    console.error('parse error ', e)
    return defaultValue
  }
}

export const useLocalStorage = <D>(
  key: string,
  defaultValue: D,
): [D, Dispatch<SetStateAction<D>>] => {
  const [value, setValue] = useState<D>(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    if (value !== defaultValue) {
      localStorage.setItem(key, stringify(value))
    }
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: stringify(value) }))
  }, [key, value, defaultValue])

  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue && stringify(value) !== event.newValue) {
        setValue(parse(event.newValue!))
      }
    },
    [key, value],
  )

  useEvent('storage', handleStorageChange)

  return [value, setValue]
}

type LocalStorageValue<T> = T | null

export function useReadLocalStorage<T>(key: string): LocalStorageValue<T> {
  const readValue = useCallback((): LocalStorageValue<T> => {
    return getStorageValue(key, null)
  }, [key])

  const [storedValue, setStoredValue] = useState<LocalStorageValue<T>>(readValue)

  // Listen if localStorage changes
  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  useEvent('storage', handleStorageChange)
  return storedValue
}

export const useLocalStorageReducer = <S = any, A = any>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction?: ((initial: any) => any) | undefined,
): [S, Dispatch<A>] => {
  const [state, dispatch] = useImmerReducer(
    reducer,
    getStorageValue(key, initialState),
    initialAction,
  )

  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem(key, stringify(state))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, state])

  return [state, dispatch]
}
