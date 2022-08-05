import { Spinner, Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

const WaitingContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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

export const Waiting = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <WaitingContainer data-testid="waiting-container">
      <StyledSpinner color="accent" />
      <WaitingTextContainer>
        <Typography weight="bold">{title}</Typography>
        <Typography>{subtitle}</Typography>
      </WaitingTextContainer>
    </WaitingContainer>
  )
}
