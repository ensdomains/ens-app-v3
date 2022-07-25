import { ForwardedRef, RefObject, useRef } from 'react'

export const useDefaultRef = <T>(ref: ForwardedRef<T>) => {
  const defaultRef = useRef<T>(null)
  return (ref as RefObject<T>) || defaultRef
}
