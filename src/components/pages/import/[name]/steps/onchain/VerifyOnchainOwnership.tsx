import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Dispatch, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CheckCircleSVG, Heading, Helper, mq, Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import RecordItem from '@app/components/RecordItem'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { shortenAddress } from '@app/utils/utils'

import { DnsDisplayValue, SuccessHelper } from '../../shared'
import { StatusChecker } from '../../StatusChecker'
import { SupportLinkList } from '../../SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from '../../useDnsImportReducer'
import { checkDnsAddressMatch, checkDnsError } from '../../utils'

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

const ValueButtonsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const ButtonRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2.5']};
    width: 100%;
  `,
)

const RecordItemWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;

    & > button {
      height: 48px;
      align-items: center;
      gap: ${theme.space['4']};

      & > div:first-of-type {
        width: min-content;
        display: block;
        flex-basis: unset;
      }
    }
  `,
)

export const VerifyOnchainOwnership = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.verifyOwnership' })
  const { t: tc } = useTranslation('common')

  const {
    data: dnsOwner,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    internal: { dataUpdatedAt },
  } = useDnsOwner({ name: selected.name })
  const { openConnectModal } = useConnectModal()

  const { address } = selected
  const isConnected = !!address

  const dnsOwnerStatus = useMemo(
    () => checkDnsAddressMatch({ address, dnsAddress: dnsOwner }),
    [address, dnsOwner],
  )

  const errorMessage = useMemo(() => {
    const errorKey = checkDnsError({ error, isLoading })
    return tc(`errors.${errorKey}`, { ns: 'dnssec' })
  }, [tc, error, isLoading])

  return (
    <StyledCard>
      <StyledHeading>{t('title')}</StyledHeading>
      {dnsOwnerStatus !== 'matching' && <Typography>{t('status.mismatching.heading')}</Typography>}
      {(() => {
        if (!isConnected) return <Helper type="info">{t('status.disconnected')}</Helper>
        if (dnsOwnerStatus === 'matching')
          return (
            <SuccessHelper>
              <CheckCircleSVG />
              {t('status.matching')}
            </SuccessHelper>
          )
        return (
          <>
            <ValueButtonsContainer>
              <ButtonRow>
                <DnsDisplayValue label="Type" value="TXT" />
                <DnsDisplayValue label="Name" value="_ens" copyable />
              </ButtonRow>
              <DnsDisplayValue label="Value" value={`a=${address}`} copyable />
            </ValueButtonsContainer>
            <SupportLinkList
              title={t('status.mismatching.help')}
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
              isError={isError}
              isLoading={isLoading}
              isRefetching={isRefetching}
              refetch={refetch}
              message={errorMessage || t('status.mismatching.message')}
              statusElement={
                dnsOwnerStatus === 'mismatching' && (
                  <RecordItemWrapper>
                    <RecordItem
                      itemKey="owner"
                      type="address"
                      value={dnsOwner!}
                      displayValue={shortenAddress(dnsOwner!)}
                    />
                  </RecordItemWrapper>
                )
              }
              statusHelperElement={
                dnsOwnerStatus === 'mismatching' && (
                  <Helper type="error">{t('status.mismatching.error.onchain')}</Helper>
                )
              }
            />
          </>
        )
      })()}
      <Buttons>
        <ResponsiveButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {tc('action.back')}
        </ResponsiveButton>
        {isConnected ? (
          <ResponsiveButton
            disabled={!dnsOwner || isLoading || isRefetching || isError}
            onClick={() => dispatch({ name: 'increaseStep', selected })}
            {...(dnsOwnerStatus === 'mismatching'
              ? {
                  colorStyle: 'redPrimary',
                  style: { width: 'min-content' },
                }
              : {})}
          >
            {dnsOwnerStatus === 'mismatching'
              ? t('action.importWithoutOwnership')
              : tc('action.next')}
          </ResponsiveButton>
        ) : (
          <ResponsiveButton disabled={!openConnectModal} onClick={() => openConnectModal?.()}>
            {tc('action.connect')}
          </ResponsiveButton>
        )}
      </Buttons>
    </StyledCard>
  )
}
