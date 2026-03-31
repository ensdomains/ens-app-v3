import { useTranslation } from 'react-i18next'

import { OutlinkSVG, Typography } from '@ensdomains/thorin'

import { useBlockExplorer } from '@app/hooks/chain/useBlockExplorer'
import type useRegistrationDate from '@app/hooks/useRegistrationData'
import { formatDateTime, formatExpiry } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const RegistrationDate = ({
  registrationData,
}: {
  registrationData: ReturnType<typeof useRegistrationDate>['data']
}) => {
  const { t } = useTranslation('common')
  const { buildTransactionUrl } = useBlockExplorer()
  if (!registrationData) return null
  const transactionUrl = buildTransactionUrl(registrationData.transactionHash)
  return (
    <DateLayout>
      <Typography>{t('name.registered')}</Typography>
      <Typography>{formatExpiry(registrationData.registrationDate)}</Typography>
      <Typography>{formatDateTime(registrationData.registrationDate)}</Typography>
      {transactionUrl && (
        <a
          target="_blank"
          href={transactionUrl}
          rel="noreferrer"
          data-testid="etherscan-registration-link"
        >
          {t('action.view')}
          <OutlinkSVG />
        </a>
      )}
    </DateLayout>
  )
}
