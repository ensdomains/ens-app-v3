import { ComponentProps } from 'react'

import { Button, Dialog } from '@ensdomains/thorin'

import { CenteredTypography } from '@app/transaction/user/input/ProfileEditor/components/CenteredTypography'

export type ButtonProps = ComponentProps<typeof Button>

export type VerificationErrorDialogProps =
  | (Omit<ComponentProps<typeof Dialog>, 'variant' | 'children'> & {
      title: string
      message: string
      actions: {
        leading?: ButtonProps
        trailing: ButtonProps
      }
    })
  | undefined

export const VerificationErrorDialog = (props: VerificationErrorDialogProps) => {
  if (!props) return null

  const { title, message, actions, ...dialogProps } = props

  return (
    <Dialog {...dialogProps} variant="blank">
      <Dialog.Heading title={title} alert="warning" />
      <Dialog.Content>
        <CenteredTypography>{message}</CenteredTypography>
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
