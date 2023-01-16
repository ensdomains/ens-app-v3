import { Trans, useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

type Props = {
  onDismiss: () => void
}

export const RevokeChangeFusesWarningView = ({ onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        alert="warning"
        title={t('input.revokePermissions.views.revokeChangeFusesWarning.title')}
        onDismiss={() => onDismiss()}
      />
      <CenterAlignedTypography>
        <Trans t={t} i18nKey="input.revokePermissions.views.revokeChangeFusesWarning.subtitle" />
      </CenterAlignedTypography>
    </>
  )
}
