import { Dispatch, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Card, CheckCircleSVG, Heading, Helper, mq, RecordItem } from '@ensdomains/thorin'

import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { shortenAddress } from '@app/utils/utils'

import { DnsDisplayValue, SuccessHelper } from './shared'
import { StatusChecker } from './StatusChecker'
import { SupportLinkList } from './SupportLinkList'
import { DnsImportReducerAction, SelectedItemProperties } from './useDnsImportReducer'
import { checkDnsOwnerError, checkDnsOwnerMatch } from './utils'

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

export const VerifyOffchainOwnership = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { address } = selected
  const isConnected = !!address

  const {
    data: dnsOwner,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    internal: { dataUpdatedAt },
  } = useDnsOwner({ name: selected.name })

  const dnsOwnerStatus = useMemo(
    () => checkDnsOwnerMatch({ address, dnsOwner }),
    [address, dnsOwner],
  )

  const errorMessage = useMemo(() => checkDnsOwnerError({ error, isLoading }), [error, isLoading])

  return (
    <StyledCard>
      <StyledHeading>Verify Ownership</StyledHeading>
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
              <DnsDisplayValue label="Value" value={`ENS1 ${address} ${address}`} copyable />
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
                    The record found does not match your connected address. You can still import
                    this name, but you will not have ownership of it.
                  </Helper>
                )
              }
            />
          </>
        )
      })()}
    </StyledCard>
  )
}
