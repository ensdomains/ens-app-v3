import { Dispatch, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Button, CurrencyToggle, Heading, Helper, mq, Typography } from '@ensdomains/thorin'

import { CurrencyText } from '@app/components/@atoms/CurrencyText/CurrencyText'
import GasDisplay from '@app/components/@atoms/GasDisplay'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { Card } from '@app/components/Card'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import {
  addStateOverride,
  useEstimateGasWithStateOverride,
} from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useGasPrice } from '@app/hooks/chain/useGasPrice'
import { useDnsImportData } from '@app/hooks/ensjs/dns/useDnsImportData'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useApprovedForAll } from '@app/hooks/useApprovedForAll'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import useUserConfig from '@app/utils/useUserConfig'
import { shortenAddress } from '@app/utils/utils'

import { DnsImportReducerAction, SelectedItemProperties } from '../useDnsImportReducer'
import { checkDnsOwnerMatch } from '../utils'

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

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const InvoiceContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const InvoiceItemBox = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    background-color: ${theme.colors.greySurface};
  `,
)

const InvoiceDnsOwnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    text-align: right;
  `,
)

const InvoiceDnsOwner = ({ dnsOwner }: { dnsOwner: Address }) => {
  const { data: primary } = usePrimaryName({ address: dnsOwner })

  return (
    <InvoiceDnsOwnerContainer>
      <div>
        {primary?.beautifiedName && (
          <Typography fontVariant="bodyBold">{primary.beautifiedName}</Typography>
        )}
        <Typography fontVariant="small" color="grey">
          {shortenAddress(dnsOwner)}
        </Typography>
      </div>
      <AvatarWithZorb size="10" address={dnsOwner} name={primary?.name} label="dns owner avatar" />
    </InvoiceDnsOwnerContainer>
  )
}

export const ImportTransaction = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const { gasPrice } = useGasPrice()
  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const { data: dnsOwner, isLoading, isError, isRefetching } = useDnsOwner({ name: selected.name })

  const { address } = selected

  const dnsOwnerStatus = useMemo(
    () => checkDnsOwnerMatch({ address, dnsOwner }),
    [address, dnsOwner],
  )

  const { data: dnsImportData } = useDnsImportData({
    name: selected.name,
  })

  const { data: isApprovedForAll, isFetched: isApprovalFetched } = useApprovedForAll({
    contract: 'ensPublicResolver',
    address: selected.address!,
    operatorContract: 'ensDnsRegistrar',
    enabled: dnsOwnerStatus === 'matching',
  })

  const publicResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })
  const dnsRegistrarAddress = useContractAddress({
    contract: 'ensDnsRegistrar',
  })

  const requiresApproval =
    dnsOwnerStatus === 'matching' && isApprovedForAll === false && isApprovalFetched

  const { transactions, estimators } = useMemo(() => {
    const createApproveTx = () =>
      createTransactionItem('approveDnsRegistrar', {
        address: selected.address!,
      })
    const createClaimTx = () =>
      createTransactionItem('claimDnsName', {
        name: selected.name,
        dnsImportData: dnsImportData!,
        address: selected.address!,
      })
    const createImportTx = () =>
      createTransactionItem('importDnsName', {
        name: selected.name,
        dnsImportData: dnsImportData!,
      })

    if (dnsOwnerStatus === 'matching') {
      const claimTx = createClaimTx()
      if (requiresApproval) {
        const claimTxWithOverride = addStateOverride({
          item: claimTx,
          stateOverride: [
            {
              address: publicResolverAddress,
              stateDiff: [
                // `_operatorApprovals[owner][dnsRegistrarAddress] = true`
                {
                  slot: 11,
                  keys: [selected.address!, dnsRegistrarAddress],
                  value: true,
                },
              ],
            },
          ],
        })
        const approvalTx = createApproveTx()
        return {
          transactions: [approvalTx, claimTx],
          estimators: [approvalTx, claimTxWithOverride],
        } as const
      }
      return { transactions: [claimTx] } as const
    }
    return { transactions: [createImportTx()] } as const
  }, [
    dnsOwnerStatus,
    selected.address,
    selected.name,
    dnsImportData,
    requiresApproval,
    publicResolverAddress,
    dnsRegistrarAddress,
  ])

  const {
    data: { gasCost },
    isLoading: isEstimateLoading,
  } = useEstimateGasWithStateOverride({
    transactions: estimators || transactions,
    enabled: !!dnsImportData && (!requiresApproval || isApprovalFetched),
  })

  const { createTransactionFlow, resumeTransactionFlow, getResumable, getLatestTransaction } =
    useTransactionFlow()

  const key = `importDnsName-${selected.name}`

  const resumable = getResumable(key)

  const tx = getLatestTransaction(key)

  const isComplete =
    tx?.stage === 'complete' && (tx.name === 'claimDnsName' || tx.name === 'importDnsName')

  const startOrResumeFlow = () => {
    if (resumable) return resumeTransactionFlow(key)
    return createTransactionFlow(key, {
      transactions,
      resumable: true,
    })
  }

  useEffect(() => {
    if (isComplete) {
      dispatch({ name: 'increaseStep', selected })
    }
  }, [dispatch, isComplete, selected])

  return (
    <StyledCard>
      {dnsOwnerStatus === 'mismatching' ? (
        <>
          <StyledHeading>Import this domain</StyledHeading>
          <Typography>
            Your ownership has <b>not</b> been verified. You can still import this domain.
          </Typography>
        </>
      ) : (
        <>
          <StyledHeading>Claim your domain</StyledHeading>
          <Typography>Your ownership has been verified.</Typography>
        </>
      )}
      <InvoiceContainer>
        <OptionBar>
          <GasDisplay gasPrice={gasPrice} />
          <CurrencyToggle
            size="small"
            checked={userConfig.currency === 'fiat'}
            onChange={(e) => setCurrency(e.target.checked ? 'fiat' : 'eth')}
          />
        </OptionBar>
        <InvoiceItemBox>
          <Typography>Estimated network cost</Typography>
          <CurrencyText eth={gasCost} currency={currencyDisplay} />
        </InvoiceItemBox>
        <InvoiceItemBox>
          <Typography>Owner</Typography>
          {dnsOwner && <InvoiceDnsOwner dnsOwner={dnsOwner} />}
        </InvoiceItemBox>
      </InvoiceContainer>
      {dnsOwnerStatus === 'mismatching' && (
        <Helper type="warning">
          The owner does not match your address. You can still import this DNS name, but you will
          not have ownership of it.
        </Helper>
      )}
      <Buttons>
        <ResponsiveButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          Back
        </ResponsiveButton>
        <ResponsiveButton
          disabled={!dnsOwner || isLoading || isRefetching || isError || gasCost === 0n}
          loading={isLoading || isEstimateLoading}
          onClick={() => startOrResumeFlow()}
        >
          {dnsOwnerStatus === 'mismatching' ? 'Import' : 'Claim'}
        </ResponsiveButton>
      </Buttons>
    </StyledCard>
  )
}
