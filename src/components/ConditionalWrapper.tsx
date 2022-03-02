import { ReactNode } from 'react'

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: any
  wrapper: (children: ReactNode) => JSX.Element
  children: JSX.Element
}) => (condition ? wrapper(children) : children)
