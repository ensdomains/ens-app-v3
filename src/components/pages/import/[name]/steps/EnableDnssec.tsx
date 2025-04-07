import { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckCircleSVG, Typography } from '@ensdomains/thorin'

import { DNSSEC_HELP_LINKS } from '@app/constants/dnsLinks'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'
import { sendEvent } from '@app/utils/analytics/events'

import {
  DnsImportActionButton,
  DnsImportActionsContainer,
  DnsImportCard,
  DnsImportHeading,
  SuccessHelper,
} from '../shared'
import { StatusChecker } from '../StatusChecker'
import { SupportLinkList } from '../SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from '../useDnsImportReducer'

export const EnableDnssec = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.enableDnssec' })
  const { t: tc } = useTranslation('common')

  const {
    data: isDnsSecEnabled,
    isLoading,
    refetch,
    isRefetching,
    dataUpdatedAt,
    errorUpdatedAt,
  } = useDnsSecEnabled({
    name: selected.name,
  })

  return (
    <DnsImportCard>
      <DnsImportHeading>{t('title')}</DnsImportHeading>
      {isDnsSecEnabled ? (
        <SuccessHelper>
          <CheckCircleSVG />
          {t('status.enabled')}
        </SuccessHelper>
      ) : (
        <>
          <Typography>{t('status.disabled.heading')}</Typography>
          <SupportLinkList
            title={t('status.disabled.help')}
            items={[
              {
                label: t('help.findOutRegistrar'),
                href: `https://who.is/whois/${selected.name}`,
              },
              ...DNSSEC_HELP_LINKS,
            ]}
          />
          <StatusChecker
            dataUpdatedAt={dataUpdatedAt}
            errorUpdatedAt={errorUpdatedAt}
            isLoading={isLoading}
            isRefetching={isRefetching}
            message={t('status.disabled.message')}
            refetch={refetch}
          />
        </>
      )}
      <DnsImportActionsContainer>
        <DnsImportActionButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {tc('action.back')}
        </DnsImportActionButton>
        <DnsImportActionButton
          disabled={!isDnsSecEnabled || isLoading || isRefetching}
          onClick={() => {
            sendEvent('import:dnssec_enable', {
              name: selected.name,
            })
            dispatch({ name: 'increaseStep', selected })
          }}
          data-testid="import-next-button"
        >
          {tc('action.next')}
        </DnsImportActionButton>
      </DnsImportActionsContainer>
    </DnsImportCard>
  )
}
