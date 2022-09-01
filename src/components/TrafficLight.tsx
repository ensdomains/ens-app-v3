import styled, { css } from 'styled-components'

import { Colors, Space } from '@ensdomains/thorin'

export const TrafficLight = styled.div<{
  $go: boolean
  $size?: Space
  $color?: Colors
}>(
  ({ theme, $go, $size, $color }) => css`
    width: ${theme.space[$size ?? '5']};
    height: ${theme.space[$size ?? '5']};
    border-radius: 50%;

    ${$color
      ? css`
          background-color: ${theme.colors[$color]};
        `
      : css`
          background-color: ${$go ? theme.colors.green : theme.colors.red};
        `}
  `,
)
