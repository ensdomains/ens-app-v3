import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin2'

export const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)
