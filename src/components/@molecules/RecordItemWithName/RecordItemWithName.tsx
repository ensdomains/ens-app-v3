import { ComponentProps, useRef, useSyncExternalStore } from 'react'

import { RecordItem, Typography } from '@ensdomains/thorin'

import { Name } from '@app/components/@atoms/Name2/Name'
import { useRemPixelValue } from '@app/hooks/dom/useRemPixelValue'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

type RecordItemProps = ComponentProps<typeof RecordItem>
type Props = { name: string } & RecordItemProps
export const RecordItemWithName = ({ name, keyLabel, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  const breakpoints = useBreakpoint()
  const remPixelValue = useRemPixelValue()

  const maxWidth = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange)
      return () => {
        window.removeEventListener('resize', onStoreChange)
      }
    },
    () => {
      if (!ref.current || !ref2.current || !ref.current.parentElement) return undefined
      const label = ref2.current.offsetWidth
      const width = ref.current.parentElement.offsetWidth
      const padding = remPixelValue * 2 * 0.75
      const gap = remPixelValue * 2 * 0.5
      const ellipsis = remPixelValue * 0.75
      const result = width - padding - gap - label - ellipsis
      return result
    },
    () => {
      return undefined
    },
  )

  return (
    <RecordItem
      inline
      ref={ref}
      {...props}
      keyLabel={
        <Typography
          ref={ref2}
          color="greyPrimary"
          fontVariant={breakpoints.sm ? 'bodyBold' : 'smallBold'}
        >
          {keyLabel}
        </Typography>
      }
    >
      <Name type="inline" maxWidth={maxWidth} debug>
        {name}
      </Name>
    </RecordItem>
  )
}
