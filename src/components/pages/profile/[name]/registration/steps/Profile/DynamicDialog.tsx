import { ReactNode } from 'react'

import { Dialog } from '@ensdomains/thorin'

type Props = {
  children: ReactNode
}

export const DynamicDialog = ({ children }: Props) => {
  const open = false
  return (
    <Dialog variant="closable" open={open} onDismiss={() => {}} title="Add profile fields">
      {children}
    </Dialog>
  )
}
