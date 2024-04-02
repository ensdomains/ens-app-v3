import { RefObject, useRef, useSyncExternalStore } from 'react'

const defaultRect = { width: undefined, height: undefined, top: undefined, left: undefined }

const getBoundingClientRect = (node?: HTMLDivElement) => {
  if (!node) return defaultRect
  const rect = node.getBoundingClientRect()
  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    top: Math.round(rect.top),
    left: Math.round(rect.left),
  }
}

export const useElementDimensions = ({
  ref,
  boundingRect = false,
}: {
  ref: RefObject<HTMLDivElement>
  boundingRect?: boolean
}) => {
  const store = useRef<{ width?: number; height?: number; top?: number; left?: number }>(
    defaultRect,
  )
  return useSyncExternalStore(
    (onStoreChange) => {
      console.log('>>>>>>>>> SUBSCRIBE')
      window.addEventListener('resize', onStoreChange)
      return () => {
        console.log('>>>>>>>>> UNSUBSCRIBE')
        window.removeEventListener('resize', onStoreChange)
      }
    },
    () => {
      console.log('>>>>>>>> useELEMENTDIMENSIONS')
      if (!ref.current) return store.current
      const rect = boundingRect
        ? getBoundingClientRect(ref.current)
        : {
            width: ref.current.offsetWidth,
            height: ref.current.offsetHeight,
            top: undefined,
            left: undefined,
          }
      if (
        store.current.width !== rect.width ||
        store.current.height !== rect.height ||
        store.current.top !== rect.top ||
        store.current.left !== rect.left
      ) {
        store.current = rect
      }
      return store.current
    },
    () => {
      return store.current
    },
  )
}
