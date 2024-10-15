import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Dispatch, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckCircleSVG, Helper, Typography } from '@ensdomains/thorin'

import RecordItem from '@app/components/RecordItem'
import { DNS_TXT_RECORD_HELPER_LINKS } from '@app/constants/dnsLinks'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { shortenAddress } from '@app/utils/utils'

import {
  DnsDisplayValue,
  DnsImportActionButton,
  DnsImportActionsContainer,
  DnsImportCard,
  DnsImportHeading,
  SuccessHelper,
} from '../../shared'
import { StatusChecker } from '../../StatusChecker'
import { SupportLinkList } from '../../SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from '../../useDnsImportReducer'
import { checkDnsAddressMatch, checkDnsError } from '../../utils'

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
  const { t } = useTranslation('dnssec')
  const { t: tc } = useTranslation('common')

  const {
    data: dnsOwner,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    dataUpdatedAt,
    errorUpdatedAt,
  } = useDnsOwner({ name: selected.name, strict: true })

  const { openConnectModal } = useConnectModal()

  const { address } = selected
  const isConnected = !!address

  const dnsOwnerStatus = useMemo(
    () => checkDnsAddressMatch({ address, dnsAddress: dnsOwner }),
    [address, dnsOwner],
  )

  const errorMessage = useMemo(() => {
    const errorKey = checkDnsError({ error, isLoading })
    if (!errorKey) return null
    return tc(`error.${errorKey}`, { ns: 'dnssec' })
  }, [tc, error, isLoading])

  return (
    <DnsImportCard>
      <DnsImportHeading>{t('steps.verifyOwnership.title')}</DnsImportHeading>
      {dnsOwnerStatus !== 'matching' && (
        <Typography>{t('steps.verifyOwnership.status.mismatching.heading')}</Typography>
      )}
      {(() => {
        if (!isConnected)
          return <Helper type="info">{t('steps.verifyOwnership.status.disconnected')}</Helper>
        if (dnsOwnerStatus === 'matching')
          return (
            <SuccessHelper>
              <CheckCircleSVG />
              {t('steps.verifyOwnership.status.matching')}
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
              title={t('steps.verifyOwnership.status.mismatching.help')}
              items={DNS_TXT_RECORD_HELPER_LINKS}
            />
            <StatusChecker
              dataUpdatedAt={dataUpdatedAt}
              errorUpdatedAt={errorUpdatedAt}
              isLoading={isLoading}
              isRefetching={isRefetching}
              refetch={refetch}
              message={errorMessage || t('steps.verifyOwnership.status.mismatching.message')}
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
                  <Helper type="error">
                    {t('steps.verifyOwnership.status.mismatching.error.onchain')}
                  </Helper>
                )
              }
            />
          </>
        )
      })()}
      <DnsImportActionsContainer>
        <DnsImportActionButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {tc('action.back')}
        </DnsImportActionButton>
        {isConnected ? (
          <DnsImportActionButton
            disabled={!dnsOwner || isLoading || isRefetching || isError}
            onClick={() => dispatch({ name: 'increaseStep', selected })}
            data-testid="import-next-button"
            {...(dnsOwnerStatus === 'mismatching'
              ? {
                  colorStyle: 'redPrimary',
                  style: { width: 'min-content' },
                }
              : {})}
          >
            {dnsOwnerStatus === 'mismatching'
              ? t('steps.verifyOwnership.action.importWithoutOwnership')
              : tc('action.next')}
          </DnsImportActionButton>
        ) : (
          <DnsImportActionButton disabled={!openConnectModal} onClick={() => openConnectModal?.()}>
            {tc('action.connect')}
          </DnsImportActionButton>
        )}
      </DnsImportActionsContainer>
    </DnsImportCard>
  )
}
