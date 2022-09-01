import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

export const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['4']};
    max-height: 60vh;
    max-width: 100vw;
    overflow-y: auto;
    ${mq.sm.min(css`
      min-width: ${theme.space['128']};
    `)}
  `,
)
