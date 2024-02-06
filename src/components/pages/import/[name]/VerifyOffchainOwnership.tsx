import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Dispatch } from 'react'
import styled, { css } from 'styled-components'

import { Button, Card, CheckCircleSVG, Heading, Helper, mq } from '@ensdomains/thorin'

import RecordItem from '@app/components/RecordItem'
import { offchainDnsAddress, useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { useDnsOffchainData } from '@app/hooks/ensjs/dns/useDnsOffchainData'
import { shortenAddress } from '@app/utils/utils'

import { DnsDisplayValue, SuccessHelper } from './shared'
import { StatusChecker } from './StatusChecker'
import { SupportLinkList } from './SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from './useDnsImportReducer'

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

export const VerifyOffchainOwnership = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { address, chainId } = selected
  const isConnected = !!address

  const {
    data: dnsOffchainData,
    isLoading,
    isError,
    isRefetching,
    refetch,
    internal: { dataUpdatedAt },
  } = useDnsOffchainData({ name: selected.name })

  const { data: dnsOffchainStatus } = useDnsOffchainStatus({
    name: selected.name,
  })

  const { openConnectModal } = useConnectModal()

  return (
    <StyledCard>
      <StyledHeading>Verify Ownership</StyledHeading>
      {(() => {
        if (!isConnected)
          return <Helper type="info">Connect your wallet to verify ownership.</Helper>
        if (dnsOffchainStatus?.address === 'matching')
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
                <DnsDisplayValue label="Name" value="@" copyable />
              </ButtonRow>
              <DnsDisplayValue
                lines={2}
                label="Value"
                value={`ENS1 ${
                  offchainDnsAddress[String(chainId) as keyof typeof offchainDnsAddress]
                } ${address}`}
                copyable
              />
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
              message="No record found"
              statusElement={
                dnsOffchainStatus?.address === 'mismatching' &&
                dnsOffchainData?.resolverAddress && (
                  <RecordItemWrapper>
                    <RecordItem
                      itemKey="owner"
                      type="address"
                      value={dnsOffchainData.resolverAddress}
                      displayValue={shortenAddress(dnsOffchainData?.resolverAddress!)}
                    />
                  </RecordItemWrapper>
                )
              }
              statusHelperElement={
                dnsOffchainStatus?.address === 'mismatching' && (
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
            disabled={!dnsOffchainData || isLoading || isRefetching || isError}
            onClick={() => dispatch({ name: 'increaseStep', selected })}
            {...(dnsOffchainStatus?.address === 'mismatching'
              ? {
                  colorStyle: 'redPrimary',
                  style: { width: 'min-content' },
                }
              : {})}
          >
            {dnsOffchainStatus?.address === 'mismatching' ? 'Import without ownership' : 'Finish'}
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
