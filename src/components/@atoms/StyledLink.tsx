import { forwardRef, PropsWithChildren } from 'react'

import { Box, BoxProps } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'

const StyledAnchor = forwardRef<HTMLElement, BoxProps & { $color: 'grey' | 'accent' }>(
  ({ $color, ...props }, ref) => (
    <Box
      {...props}
      as="a"
      ref={ref}
      color={{
        base: $color === 'grey' ? '$greyDim' : '$accent',
        hover: $color === 'grey' ? '$grey' : '$accentBright',
      }}
      fontWeight="$bold"
      transition="color 150ms ease-in-out"
    />
  ),
)

export const StyledLink = ({
  href,
  color = 'accent',
  children,
}: PropsWithChildren<{ href: string; color?: 'accent' | 'grey' }>) => {
  return (
    <BaseLink href={href} passHref>
      <StyledAnchor $color={color}>{children}</StyledAnchor>
    </BaseLink>
  )
}
