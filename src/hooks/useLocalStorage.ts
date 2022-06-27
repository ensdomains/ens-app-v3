import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const isSSR = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const getStorageValue = <D>(key: string, defaultValue: D) => {
  // getting stored value
  const saved = isSSR && localStorage.getItem(key)
  return saved ? JSON.parse(saved) : defaultValue
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
      localStorage.setItem(key, JSON.stringify(value))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value])

  return [value, setValue]
}
