import { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CheckCircleSVG, Heading, mq, Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'

import { SuccessHelper } from '../shared'
import { StatusChecker } from '../StatusChecker'
import { SupportLinkList } from '../SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from '../useDnsImportReducer'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const StyledHeading = styled(Heading)(
  () => css`
    width: 100%;
    text-align: center;
    word-break: break-all;

    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
      word-break: normal;
    }
  `,
)

const Buttons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const ResponsiveButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;

    ${mq.sm.min(css`
      width: ${theme.space['40']};
    `)}
  `,
)

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
    <StyledCard>
      <StyledHeading>{t('title')}</StyledHeading>
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
      <Buttons>
        <ResponsiveButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {tc('action.back')}
        </ResponsiveButton>
        <ResponsiveButton
          disabled={!isDnsSecEnabled || isLoading || isRefetching}
          onClick={() => dispatch({ name: 'increaseStep', selected })}
        >
          {tc('action.next')}
        </ResponsiveButton>
      </Buttons>
    </StyledCard>
  )
}
