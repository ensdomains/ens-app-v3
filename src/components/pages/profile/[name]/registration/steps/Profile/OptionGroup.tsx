import { forwardRef, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{}>
export const OptionGroup = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }: Props, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
