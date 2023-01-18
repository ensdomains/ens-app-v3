import { ComponentProps } from 'react'

import BaseLink from '../BaseLink'

type Props = ComponentProps<typeof BaseLink> & { active?: boolean }

export const OptionalLink = ({ children, active, ...props }: Props) => {
  if (!active) {
    return <>{children}</>
  }
  return <BaseLink {...props}>{children}</BaseLink>
}
