import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { AlertSVG, Button } from '@ensdomains/thorin'

import { DeleteButton } from '@app/components/pages/profile/[name]/registration/steps/Profile/DeleteButton'
import mq from '@app/mediaQuery'

const Container = styled.div(({ theme }) => [
  css`
    width: 100%;
    padding: ${theme.space['2.5']};

    display: flex;
    flex-direction: column;
    gap: ${theme.space[6]};
  `,
  mq.sm.min(css`
    width: 520px;
  `),
])

const DeleteButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
  `,
)

const Header = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space[2]};
  `,
  mq.md.min(css``),
])

const Icon = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.yellow};
    width: ${theme.space[8]};
    height: ${theme.space[8]};
    border-radius: ${theme.radii.full};

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      display: block;
      width: ${theme.space[4]};
      height: ${theme.space[4]};
      color: white;
    }
  `,
)

const Title = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['5.5']};
    font-weight: ${theme.fontWeights.bold};
    line-height: 1.3637;
    text-align: center;
  `,
)

const Description = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.root};
    line-height: ${theme.space[5]};
    text-align: center;
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    gap: ${theme.space[2]};
  `,
)

const ButtonInner = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.root};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.space[5]};
  `,
)

type Props = {
  title?: string
  description?: string
  confirmLabel?: string
  declineLabel?: string
  onConfirm?: () => void
  onDecline?: () => void
} & HTMLAttributes<HTMLDivElement>

export const ConfirmationDialogView = ({
  title,
  description,
  confirmLabel,
  declineLabel,
  onConfirm,
  onDecline,
  ...props
}: Props) => {
  return (
    <Container {...props}>
      <DeleteButtonWrapper>
        <DeleteButton size="large" onClick={onDecline} />
      </DeleteButtonWrapper>
      <Header>
        <Icon>
          <AlertSVG />
        </Icon>
        <Title>{title}</Title>
      </Header>
      <Description>{description}</Description>
      <ButtonContainer>
        <Button
          size="medium"
          variant="secondary"
          onClick={onDecline}
          data-testid="confirmation-dialog-decline-button"
        >
          <ButtonInner>{declineLabel}</ButtonInner>
        </Button>
        <Button
          size="medium"
          variant="primary"
          onClick={onConfirm}
          data-testid="confirmation-dialog-confirm-button"
        >
          <ButtonInner>{confirmLabel}</ButtonInner>
        </Button>
      </ButtonContainer>
    </Container>
  )
}
