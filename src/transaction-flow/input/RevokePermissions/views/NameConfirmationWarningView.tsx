import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, Input } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'
import type { RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  expiry: Date
  name: string
  setDisabled: (v: boolean) => void
} & RevokePermissionsDialogContentProps

export const NameConfirmationWarningView = forwardRef<HTMLFormElement, Props>(
  ({ expiry, name, setDisabled, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.lastWarning.title')} />
        <Dialog.Content {...dialogContentProps} ref={ref}>
          <CenterAlignedTypography color="red" weight="bold">
            {t('input.revokePermissions.views.lastWarning.subtitle', {
              date: Intl.DateTimeFormat(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(expiry),
            })}
          </CenterAlignedTypography>
          <CenterAlignedTypography>
            {t('input.revokePermissions.views.lastWarning.message', { name })}
          </CenterAlignedTypography>
          <Input
            placeholder="Enter your ENS name"
            label=""
            data-testid="input-name-confirmation"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            onChange={(e) => {
              setDisabled(e.currentTarget.value !== name)
            }}
          />
        </Dialog.Content>
      </>
    )
  },
)
