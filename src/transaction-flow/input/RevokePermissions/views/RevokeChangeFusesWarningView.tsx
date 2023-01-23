import { Trans, useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

export const RevokeChangeFusesWarningView = () => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        alert="warning"
        title={t('input.revokePermissions.views.revokeChangeFusesWarning.title')}
      />
      <CenterAlignedTypography>
        <Trans t={t} i18nKey="input.revokePermissions.views.revokeChangeFusesWarning.subtitle" />
      </CenterAlignedTypography>
    </>
  )
}
