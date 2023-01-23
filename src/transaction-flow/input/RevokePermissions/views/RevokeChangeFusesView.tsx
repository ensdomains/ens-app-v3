import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { PermissionsCheckbox } from '@app/components/@molecules/PermissionsCheckbox/PermissionsCheckbox'

import type { FormData } from '../RevokePermissions-flow'
import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

type Props = {
  register: UseFormRegister<FormData>
}

export const RevokeChangeFusesView = ({ register }: Props) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.revokeChangeFuses.title')} />
      <CenterAlignedTypography>
        {t('input.revokePermissions.views.revokeChangeFuses.subtitle')}
      </CenterAlignedTypography>
      <PermissionsCheckbox
        title={t('input.revokePermissions.views.revokeChangeFuses.fuses.CANNOT_BURN_FUSES')}
        {...register('fuseObj.CANNOT_BURN_FUSES')}
      />
    </>
  )
}
