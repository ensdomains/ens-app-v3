import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Dispatch, useMemo } from 'react'
import styled, { css } from 'styled-components'

import {
  BaseError,
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
} from '@ensdomains/ensjs'
import { Button, CheckCircleSVG, Heading, Helper, mq, Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'

import { DnsDisplayValue, SuccessHelper } from '../shared'
import { StatusChecker } from '../StatusChecker'
import { SupportLinkList } from '../SupportLinkList'
import {
  DnsImportReducerAction,
  DnsImportReducerDataItem,
  SelectedItemProperties,
} from '../useDnsImportReducer'

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

export const VerifyOnchainOwnership = ({
  dispatch,
  item,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  item: DnsImportReducerDataItem
  selected: SelectedItemProperties
}) => {
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

  const dnsOwnerStatus = useMemo(() => {
    if (!address || !dnsOwner) return null
    if (dnsOwner !== address) return 'mismatching'
    return 'matching'
  }, [address, dnsOwner])

  const errorMessage = useMemo(() => {
    if (!error || isLoading) return null
    if (!(error instanceof BaseError)) return 'unknown'
    if (error instanceof DnsResponseStatusError) {
      if (error.responseStatus !== 'NXDOMAIN') return 'unknown'
      return 'noTxtRecord'
    }
    if (error instanceof DnsDnssecVerificationFailedError) return 'dnssecFailure'
    if (error instanceof DnsNoTxtRecordError) return 'noTxtRecord'
    if (error instanceof DnsInvalidTxtRecordError) return 'invalidTxtRecord'
    if (error instanceof DnsInvalidAddressChecksumError) return 'invalidAddressChecksum'
    return 'unknown'
  }, [error, isLoading])

  return (
    <StyledCard>
      <StyledHeading>Verify Ownership</StyledHeading>
      {dnsOwnerStatus !== 'matching' && (
        <Typography>Add the DNS record below to verify your ownership of this domain.</Typography>
      )}
      {(() => {
        if (!isConnected)
          return <Helper type="info">Connect your wallet to verify ownership.</Helper>
        if (dnsOwnerStatus === 'matching')
          return (
            <SuccessHelper>
              <CheckCircleSVG />A record matching your connected address was found.
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
              title="Help adding TXT records"
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
              message={errorMessage || 'No record found'}
              statusElement={
                dnsOwnerStatus === 'mismatching' && (
                  <div style={{ width: '100%' }}>
                    <DnsDisplayValue label="Value" value={`a=${dnsOwner}`} />
                  </div>
                )
              }
              statusHelperElement={
                dnsOwnerStatus === 'mismatching' && (
                  <Helper type="error">
                    The record found does not match your connected address. You can still import
                    this name, but you will not have ownership of it.
                  </Helper>
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
          Back
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
            {dnsOwnerStatus === 'mismatching' ? 'Import without ownership' : 'Next'}
          </ResponsiveButton>
        ) : (
          <ResponsiveButton disabled={!openConnectModal} onClick={() => openConnectModal?.()}>
            Connect
          </ResponsiveButton>
        )}
      </Buttons>
    </StyledCard>
  )
}
