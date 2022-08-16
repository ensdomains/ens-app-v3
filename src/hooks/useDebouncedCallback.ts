import { useCallback, useRef } from 'react'

export default function useDebouncedCallback<T extends (...args: any[]) => ReturnType<T>>(
  func: T,
  wait?: number,
): T {
  const timerId = useRef<NodeJS.Timer>()

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerId.current)
      timerId.current = setTimeout(() => func(...args), wait)
    },
    [func, wait],
  ) as T
}
