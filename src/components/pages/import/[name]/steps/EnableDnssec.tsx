import { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckCircleSVG, Typography } from '@ensdomains/thorin'

import { DNSSEC_HELP_LINKS } from '@app/constants/dnsLinks'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'

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
  const { t } = useTranslation('dnssec')

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
      <DnsImportHeading>{t('steps.enableDnssec.title')}</DnsImportHeading>
      {isDnsSecEnabled ? (
        <SuccessHelper>
          <CheckCircleSVG />
          {t('steps.enableDnssec.status.enabled')}
        </SuccessHelper>
      ) : (
        <>
          <Typography>{t('steps.enableDnssec.status.disabled.heading')}</Typography>
          <SupportLinkList
            title={t('steps.enableDnssec.status.disabled.help')}
            items={[
              {
                label: t('steps.enableDnssec.help.findOutRegistrar'),
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
            message={t('steps.enableDnssec.status.disabled.message')}
            refetch={refetch}
          />
        </>
      )}
      <DnsImportActionsContainer>
        <DnsImportActionButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {t('action.back', { ns: 'common' })}
        </DnsImportActionButton>
        <DnsImportActionButton
          disabled={!isDnsSecEnabled || isLoading || isRefetching}
          onClick={() => dispatch({ name: 'increaseStep', selected })}
          data-testid="import-next-button"
        >
          {t('action.next', { ns: 'common' })}
        </DnsImportActionButton>
      </DnsImportActionsContainer>
    </DnsImportCard>
  )
}
