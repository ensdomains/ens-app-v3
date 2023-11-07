import styled, { css } from 'styled-components'

import { Box, BoxProps } from '@ensdomains/thorin'

export const TabWrapper = (props: BoxProps) => (
  <Box
    {...props}
    bg="$background"
    borderRadius="$2.5xLarge"
    border="1px solid"
    borderColor="$border"
  />
)
export const TabWrapper2 = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.border};
  `,
)
