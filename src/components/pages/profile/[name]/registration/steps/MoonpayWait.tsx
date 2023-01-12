import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

export const MoonpayWait = () => {
  return <StyledCard>Moonpay Wait</StyledCard>
}
