import styled, { css } from 'styled-components'

import { Space } from '@ensdomains/thorin2'

export const Spacer = styled.div<{ $height: Space }>(
  ({ theme, $height }) => css`
    width: 100%;
    height: ${theme.space[$height]};
  `,
)
