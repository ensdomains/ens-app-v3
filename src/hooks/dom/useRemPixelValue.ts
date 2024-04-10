import { useSyncExternalStore } from 'react'

const DEFAULT_PIXEL_VALUE = 16

export const useRemPixelValue = () => {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange)
      return () => {
        window.removeEventListener('resize', onStoreChange)
      }
    },
    () => {
      const { fontSize } = window.getComputedStyle(document.documentElement)
      const pixelValue = parseInt(fontSize, 10)
      return pixelValue
    },
    () => {
      return DEFAULT_PIXEL_VALUE
    },
  )
}
