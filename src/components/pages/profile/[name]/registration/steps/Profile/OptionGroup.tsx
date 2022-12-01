import { PropsWithChildren, forwardRef } from 'react'

type Props = PropsWithChildren<{}>
export const OptionGroup = forwardRef<HTMLDivElement, Props>(({ children }: Props, ref) => {
  return <div ref={ref}>{children}</div>
})
