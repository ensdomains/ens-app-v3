import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Spinner, Typography } from '@ensdomains/thorin'

const WaitingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['3']};
  `,
)

const WaitingTextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    color: ${theme.colors.textSecondary};
  `,
)

const StyledSpinner = styled(Spinner)(
  ({ theme }) => css`
    width: ${theme.space['9']};
    height: ${theme.space['9']};
  `,
)

export const WaitingElement = ({ title, subTitle }) => {
  const { t } = useTranslation()

  return (
    <WaitingContainer>
      <StyledSpinner color="accent" />
      <WaitingTextContainer>
        <Typography weight="bold">{title}</Typography>
        <Typography>{subTitle}</Typography>
      </WaitingTextContainer>
    </WaitingContainer>
  )
}
