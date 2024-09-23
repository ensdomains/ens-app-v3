import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'

import { OutlinkSVG, Typography } from '@ensdomains/thorin'

import type useRegistrationDate from '@app/hooks/useRegistrationData'
import { createEtherscanLink, formatDateTime, formatExpiry } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const RegistrationDate = ({
  registrationData,
}: {
  registrationData: ReturnType<typeof useRegistrationDate>['data']
}) => {
  const { t } = useTranslation('common')
  const chainId = useChainId()
  if (!registrationData) return null
  return (
    <DateLayout>
      <Typography>{t('name.registered')}</Typography>
      <Typography>{formatExpiry(registrationData.registrationDate)}</Typography>
      <Typography>{formatDateTime(registrationData.registrationDate)}</Typography>
      <a
        target="_blank"
        href={createEtherscanLink({ data: registrationData.transactionHash, chainId })}
        rel="noreferrer"
        data-testid="etherscan-registration-link"
      >
        {t('action.view')}
        <OutlinkSVG />
      </a>
    </DateLayout>
  )
}
