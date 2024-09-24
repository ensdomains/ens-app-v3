import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Dispatch, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckCircleSVG, Helper } from '@ensdomains/thorin'

import RecordItem from '@app/components/RecordItem'
import { DNS_TXT_RECORD_HELPER_LINKS } from '@app/constants/dnsLinks'
import { EXTENDED_DNS_RESOLVER_MAP } from '@app/constants/resolverAddressData'
import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { shortenAddress } from '@app/utils/utils'

import {
  DnsDisplayValue,
  DnsImportActionButton,
  DnsImportActionsContainer,
  DnsImportCard,
  DnsImportHeading,
  SuccessHelper,
} from '../shared'
import { StatusChecker } from '../StatusChecker'
import { SupportLinkList } from '../SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from '../useDnsImportReducer'

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

const getDnsResolverValue = (chainId: number) => {
  if (chainId === 1) return 'dnsname.ens.eth'
  return EXTENDED_DNS_RESOLVER_MAP[String(chainId)]
}

export const VerifyOffchainOwnership = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { t } = useTranslation('dnssec')
  const { t: tc } = useTranslation('common')

  const { address, chainId } = selected
  const isConnected = !!address

  const {
    data: dnsOffchainStatus,
    isLoading,
    isError,
    isRefetching,
    refetch,
    error,
    dataUpdatedAt,
    errorUpdatedAt,
  } = useDnsOffchainStatus({
    name: selected.name,
  })

  const { openConnectModal } = useConnectModal()

  const errorMessage = useMemo(() => {
    if (error) return tc(`error.${error}`, { ns: 'dnssec' })
    return null
  }, [tc, error])

  return (
    <DnsImportCard>
      <DnsImportHeading>{t('steps.verifyOwnership.title')}</DnsImportHeading>
      {(() => {
        if (!isConnected)
          return <Helper type="info">{t('steps.verifyOwnership.status.disconnected')}</Helper>
        if (dnsOffchainStatus?.address?.status === 'matching')
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
                <DnsDisplayValue label="Name" value="@" copyable />
              </ButtonRow>
              <DnsDisplayValue
                label="Value"
                value={`ENS1 ${getDnsResolverValue(chainId)} ${address}`}
                copyable
              />
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
                dnsOffchainStatus?.address?.status === 'mismatching' &&
                dnsOffchainStatus?.resolver && (
                  <RecordItemWrapper>
                    <RecordItem
                      itemKey="owner"
                      type="address"
                      value={dnsOffchainStatus.address.value!}
                      displayValue={shortenAddress(dnsOffchainStatus.address.value!)}
                    />
                  </RecordItemWrapper>
                )
              }
              statusHelperElement={
                dnsOffchainStatus?.address?.status === 'mismatching' && (
                  <Helper type="error">
                    {t('steps.verifyOwnership.status.mismatching.error.offchain')}
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
            disabled={!dnsOffchainStatus || isLoading || isRefetching || isError || !!error}
            onClick={() => dispatch({ name: 'increaseStep', selected })}
            {...(dnsOffchainStatus?.address?.status === 'mismatching'
              ? {
                  colorStyle: 'redPrimary',
                  style: { width: 'min-content' },
                }
              : {})}
          >
            {dnsOffchainStatus?.address?.status === 'mismatching'
              ? tc('action.finish')
              : tc('action.claim')}
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
