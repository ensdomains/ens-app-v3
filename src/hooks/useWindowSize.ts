import { useEffect, useState } from 'react'

import { isBrowser } from '@app/utils/utils'

type RefType = HTMLElement | null | 'window'

const getDimensions = (ref: RefType, initialWidth: number, initialHeight: number) => {
  let width = initialWidth
  let height = initialHeight
  if (isBrowser) {
    if (ref === 'window') {
      width = window.innerWidth
      height = window.innerHeight
    } else if (ref) {
      width = ref.clientWidth
      height = ref.clientHeight
    }
  }

  return {
    width,
    height,
  }
}

export const useElementSize = (
  ref: HTMLElement | null | 'window',
  initialWidth = Infinity,
  initialHeight = Infinity,
) => {
  const [state, setState] = useState(getDimensions(ref, initialWidth, initialHeight))

  useEffect(() => {
    const handleResize = () => {
      setState(getDimensions(ref, initialWidth, initialHeight))
    }

    if (ref === 'window') {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    if (ref) {
      const observer = new ResizeObserver(handleResize)
      observer.observe(ref)
      return () => {
        observer.disconnect()
      }
    }
  }, [initialHeight, initialWidth, ref])

  return state
}

const useWindowSize = (initialWidth?: number, initialHeight?: number) => {
  return useElementSize('window', initialWidth, initialHeight)
}

export default useWindowSize
