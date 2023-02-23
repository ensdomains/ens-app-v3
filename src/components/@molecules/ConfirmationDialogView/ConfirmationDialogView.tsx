import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

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

const Description = styled(Typography)(
  () => css`
    text-align: center;
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
      <Dialog.Heading title={title} alert="warning" />
      <Description>{description}</Description>
      <Dialog.Footer
        leading={
          <Button
            size="medium"
            colorStyle="accentSecondary"
            onClick={onDecline}
            data-testid="confirmation-dialog-decline-button"
          >
            {declineLabel}
          </Button>
        }
        trailing={
          <Button
            size="medium"
            onClick={onConfirm}
            data-testid="confirmation-dialog-confirm-button"
          >
            {confirmLabel}
          </Button>
        }
      />
    </Container>
  )
}
