import { DependencyList, useCallback, useRef } from 'react'

export default function useThrottledCallback<T extends (...args: any[]) => ReturnType<T>>(
  func: T,
  wait = 300,
  deps: DependencyList = [],
): T {
  const lastRan = useRef(Date.now())
  const timerId = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      clearTimeout(timerId.current)
      if (now - lastRan.current >= wait) {
        lastRan.current = now
        func(...args)
      } else {
        timerId.current = setTimeout(() => func(...args), wait)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [func, wait, ...deps],
  ) as T
}
