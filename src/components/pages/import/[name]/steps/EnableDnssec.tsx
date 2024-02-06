import { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckCircleSVG, Typography } from '@ensdomains/thorin'

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
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.enableDnssec' })
  const { t: tc } = useTranslation('common')

  const {
    data: isDnsSecEnabled,
    isLoading,
    refetch,
    isRefetching,
    isError,
    internal: { dataUpdatedAt },
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
                href: 'https://example.com',
                label: 'Example 1',
              },
              {
                href: 'https://example.com',
                label: 'Example 2',
              },
              {
                href: 'https://example.com',
                label: 'Example 3',
              },
              {
                href: 'https://example.com',
                label: 'Example 4',
              },
            ]}
          />
          <StatusChecker
            dataUpdatedAt={dataUpdatedAt}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
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
          onClick={() => dispatch({ name: 'increaseStep', selected })}
        >
          {tc('action.next')}
        </DnsImportActionButton>
      </DnsImportActionsContainer>
    </DnsImportCard>
  )
}
