import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

export const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 60vh;
    max-width: 100vw;
    ${mq.sm.min(css`
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    `)}
  `,
)
