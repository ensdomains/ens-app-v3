import { useTranslation } from 'react-i18next'

import { OutlinkSVG, Typography } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/chain/useChainName'
import type useRegistrationDate from '@app/hooks/useRegistrationData'
import { formatDateTime, formatExpiry, makeEtherscanLink } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const RegistrationDate = ({
  registrationData,
}: {
  registrationData: ReturnType<typeof useRegistrationDate>['data']
}) => {
  const { t } = useTranslation('common')
  const chainName = useChainName()
  if (!registrationData) return null
  return (
    <DateLayout>
      <Typography>{t('name.registered')}</Typography>
      <Typography>{formatExpiry(registrationData.registrationDate)}</Typography>
      <Typography>{formatDateTime(registrationData.registrationDate)}</Typography>
      <a
        target="_blank"
        href={makeEtherscanLink(registrationData.transactionHash, chainName)}
        rel="noreferrer"
        data-testid="etherscan-registration-link"
      >
        {t('action.view')}
        <OutlinkSVG />
      </a>
    </DateLayout>
  )
}
