import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

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
}: Props) => {
  return (
    <>
      <Dialog.Heading title={title} alert="warning" />
      <Dialog.Content>
        <Description>{description}</Description>
      </Dialog.Content>
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
    </>
  )
}
