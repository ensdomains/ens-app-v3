import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
}

export const GrantExtendExpiryView = ({ register }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.grantExtendExpiry.title')} />
      <CheckboxRow
        label={t('input.revokePermissions.views.grantExtendExpiry.fuses.CAN_EXTEND_EXPIRY')}
        {...register(`parentFuses.CAN_EXTEND_EXPIRY`, {})}
      />
    </>
  )
}
