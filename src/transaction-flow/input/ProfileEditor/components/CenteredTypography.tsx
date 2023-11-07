import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin2'

export const CenteredTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)
