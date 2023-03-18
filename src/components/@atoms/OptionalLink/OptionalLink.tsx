import { ComponentProps } from 'react'

import { BaseLinkWithHistory } from '../BaseLink'

type Props = ComponentProps<typeof BaseLinkWithHistory> & { active?: boolean }

export const OptionalLink = ({ children, active, ...props }: Props) => {
  if (!active) {
    return <>{children}</>
  }
  return <BaseLinkWithHistory {...props}>{children}</BaseLinkWithHistory>
}
