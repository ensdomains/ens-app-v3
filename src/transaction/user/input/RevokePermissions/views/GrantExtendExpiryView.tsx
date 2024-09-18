import { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
} & RevokePermissionsDialogContentProps

export const GrantExtendExpiryView = forwardRef<HTMLFormElement, Props>(
  ({ register, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')
    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.grantExtendExpiry.title')} />
        <Dialog.Content {...dialogContentProps} ref={ref}>
          <CheckboxRow
            data-testid="checkbox-CAN_EXTEND_EXPIRY"
            label={t('input.revokePermissions.views.grantExtendExpiry.fuses.CAN_EXTEND_EXPIRY')}
            {...register(`parentFuses.CAN_EXTEND_EXPIRY`, {})}
          />
        </Dialog.Content>
      </>
    )
  },
)
