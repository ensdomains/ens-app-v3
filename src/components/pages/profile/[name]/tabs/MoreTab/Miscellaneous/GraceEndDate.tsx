import { useTranslation } from 'react-i18next'

import { Typography } from '@ensdomains/thorin'

import { GRACE_PERIOD } from '@app/utils/constants'
import { formatDateTime, formatExpiry } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const GraceEndDate = ({ expiryDate }: { expiryDate: Date }) => {
  const { t } = useTranslation('common')
  if (!expiryDate) return null

  const graceEndDate = new Date(expiryDate.getTime() + GRACE_PERIOD)

  return (
    <DateLayout>
      <Typography>{t('name.graceEnd')}</Typography>
      <Typography>{formatExpiry(graceEndDate)}</Typography>
      <Typography>{formatDateTime(graceEndDate)}</Typography>
    </DateLayout>
  )
}
