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
  children,
}: PropsWithChildren<{ nameOrAddress: string }>) => {
  return (
    <Link href={`/${nameOrAddress}`} passHref>
      <StyledAnchor>{children}</StyledAnchor>
    </Link>
  )
}
