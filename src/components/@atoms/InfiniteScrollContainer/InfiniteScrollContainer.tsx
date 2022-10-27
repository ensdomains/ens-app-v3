import { HTMLAttributes, useEffect, useRef } from 'react'

type DivProps = HTMLAttributes<HTMLDivElement>

type Props = {
  onIntersectingChange?: (value: boolean) => void
  showLoader?: boolean
} & DivProps

export const InfiniteScrollContainer = ({ onIntersectingChange, children, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let observer: IntersectionObserver
    if (ref.current) {
      observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        onIntersectingChange?.(entries[0].isIntersecting)
      }, {})
      observer.observe(ref.current)
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div {...props}>
      {children}
      <div ref={ref} />
    </div>
  )
}
