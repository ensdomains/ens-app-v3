import { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'
import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
} & RevokePermissionsDialogContentProps

export const RevokeChangeFusesView = forwardRef<HTMLFormElement, Props>(
  ({ register, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.revokeChangeFuses.title')} />
        <Dialog.Content {...dialogContentProps} ref={ref}>
          <CenterAlignedTypography>
            {t('input.revokePermissions.views.revokeChangeFuses.subtitle')}
          </CenterAlignedTypography>
          <CheckboxRow
            data-testid="checkbox-CANNOT_BURN_FUSES"
            label={t('input.revokePermissions.views.revokeChangeFuses.fuses.CANNOT_BURN_FUSES')}
            {...register('childFuses.CANNOT_BURN_FUSES')}
          />
        </Dialog.Content>
      </>
    )
  },
)
