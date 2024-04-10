import { forwardRef, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import BaseLink from '@app/components/@atoms/BaseLink'

const StyledAnchor = styled.a<{
  $color: 'accent' | 'grey'
}>(
  ({ theme, $color }) => css`
    color: ${theme.colors.accent};
    transition: color 150ms ease-in-out;
    font-weight: ${theme.fontWeights.bold};

    &:hover {
      color: ${theme.colors.accentBright};
    }

    ${$color === 'grey' &&
    css`
      color: ${theme.colors.greyDim};

      &:hover {
        color: ${theme.colors.grey};
      }
    `}
  `,
)
export const StyledLink = forwardRef(
  (
    {
      href,
      color = 'accent',
      children,
    }: PropsWithChildren<{ href: string; color?: 'accent' | 'grey' }>,
    ref,
  ) => {
    return (
      <BaseLink href={href} passHref>
        <StyledAnchor $color={color} ref={ref}>
          {children}
        </StyledAnchor>
      </BaseLink>
    )
  },
)
