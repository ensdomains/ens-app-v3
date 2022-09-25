import styled, { css } from 'styled-components'

import { Button, mq } from '@ensdomains/thorin'

export const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${theme.space['2.5']};
    width: 100%;

    & > button {
      margin: 0;
    }

    ${mq.sm.min(css`
      flex-direction: row-reverse;
      flex-wrap: wrap;
    `)}
  `,
)

export const CheckButton = styled(Button)(
  () => css`
    margin: 0 auto;
    ${mq.sm.min(css`
      width: 150px;
    `)}
  `,
)
