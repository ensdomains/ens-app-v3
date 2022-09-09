import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

const MobileFullWidth = styled.div(
  ({ theme }) => css`
    & > div,
    & {
      width: ${theme.space.full};
      max-width: ${theme.space.full};
      ${mq.md.min(css`
        min-width: ${theme.space['40']};
        width: fit-content;
        max-width: max-content;
      `)}
    }
  `,
)

export default MobileFullWidth
