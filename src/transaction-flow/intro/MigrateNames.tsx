import { useTranslation } from 'react-i18next'

import { Typography } from '@ensdomains/thorin'

export const MigrateNames = () => {
  const { t } = useTranslation('migrate')

  return <Typography>{t('details.approve.description')}</Typography>
}
