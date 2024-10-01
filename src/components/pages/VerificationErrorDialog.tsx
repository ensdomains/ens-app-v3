import { ComponentProps } from 'react'
import { Trans } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'

export type ButtonProps = ComponentProps<typeof Button>

export type VerificationErrorDialogProps =
  | (Omit<ComponentProps<typeof Dialog>, 'open' | 'variant' | 'children'> & {
      open?: boolean
      title?: string
      message?: string | ComponentProps<typeof Trans>
      actions?: {
        leading?: ButtonProps
        trailing: ButtonProps
      }
    })
  | undefined

export const VerificationErrorDialog = (
  props: VerificationErrorDialogProps = { open: false, title: '', message: '' },
) => {
  if (!props) return null

  const { title, message, actions, open, ...dialogProps } = props

  const _message = typeof message === 'string' ? message : <Trans {...message} />

  return (
    <Dialog open={open ?? false} variant="blank" {...dialogProps}>
      <Dialog.Heading title={title} alert="warning" />
      <Dialog.Content>
        <CenteredTypography>{_message}</CenteredTypography>
      </Dialog.Content>
      {actions && (
        <Dialog.Footer
          leading={actions?.leading && <Button {...actions.leading} />}
          trailing={actions?.trailing && <Button {...actions.trailing} />}
        />
      )}
    </Dialog>
  )
}
