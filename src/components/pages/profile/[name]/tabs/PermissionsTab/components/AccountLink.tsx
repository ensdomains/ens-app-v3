import Link from 'next/link'
import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.accent};
  `,
)
export const AccountLink = ({
  nameOrAddress,
  tab,
  children,
}: PropsWithChildren<{ nameOrAddress: string; tab?: string }>) => {
  const queryString = tab ? `?tab=${tab}` : ''
  return (
    <Link href={`/${nameOrAddress}${queryString}`} passHref>
      <StyledAnchor>{children}</StyledAnchor>
    </Link>
  )
}
