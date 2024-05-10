import { Trans, useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'
import type { RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

export const RevokeChangeFusesWarningView = (
  dialogContentProps: RevokePermissionsDialogContentProps,
) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        title={t('input.revokePermissions.views.revokeChangeFusesWarning.title')}
        alert="warning"
      />
      <Dialog.Content {...dialogContentProps}>
        <CenterAlignedTypography>
          <Trans t={t} i18nKey="input.revokePermissions.views.revokeChangeFusesWarning.subtitle" />
        </CenterAlignedTypography>
      </Dialog.Content>
    </>
  )
}
