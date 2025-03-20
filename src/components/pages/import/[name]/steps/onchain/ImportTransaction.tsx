import { Dispatch, useCallback, useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { CurrencyToggle, Helper, Typography } from '@ensdomains/thorin'

import { CurrencyText } from '@app/components/@atoms/CurrencyText/CurrencyText'
import GasDisplay from '@app/components/@atoms/GasDisplay'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useGasPrice } from '@app/hooks/chain/useGasPrice'
import { useDnsImportData } from '@app/hooks/ensjs/dns/useDnsImportData'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useApprovedForAll } from '@app/hooks/useApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { sendEvent } from '@app/utils/analytics/events'
import { UpdateCallback, useCallbackOnTransaction } from '@app/utils/SyncProvider/SyncProvider'
import useUserConfig from '@app/utils/useUserConfig'
import { shortenAddress } from '@app/utils/utils'

import {
  DnsImportActionButton,
  DnsImportActionsContainer,
  DnsImportCard,
  DnsImportHeading,
} from '../../shared'
import {
  DnsImportReducerAction,
  DnsImportReducerDataItem,
  SelectedItemProperties,
} from '../../useDnsImportReducer'
import { checkDnsAddressMatch, createImportTransactionRequests } from '../../utils'

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
  item,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  item: DnsImportReducerDataItem
  selected: SelectedItemProperties
}) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.transaction' })
  const { t: tc } = useTranslation('common')

  const { data: gasPrice } = useGasPrice()
  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const {
    data: dnsOwner,
    isLoading,
    isError,
    isRefetching,
  } = useDnsOwner({ name: selected.name, strict: true })

  const { address } = selected

  const dnsOwnerStatus = useMemo(
    () => checkDnsAddressMatch({ address, dnsAddress: dnsOwner }),
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

  const { transactions, estimators } = useMemo(
    () =>
      createImportTransactionRequests({
        address: selected.address!,
        name: selected.name!,
        dnsImportData: dnsImportData!,
        dnsOwnerStatus,
        requiresApproval,
        publicResolverAddress,
        dnsRegistrarAddress,
      }),
    [
      dnsOwnerStatus,
      selected.address,
      selected.name,
      dnsImportData,
      requiresApproval,
      publicResolverAddress,
      dnsRegistrarAddress,
    ],
  )

  const {
    data: { gasCost },
    isLoading: isEstimateLoading,
  } = useEstimateGasWithStateOverride({
    transactions: estimators || transactions,
    enabled: !!dnsImportData && (!requiresApproval || isApprovalFetched),
  })

  const { createTransactionFlow, resumeTransactionFlow, getResumable, getLatestTransaction } =
    useTransactionFlow()

  const key = `import-${selected.name}-${selected.address}`

  const resumable = getResumable(key)
  const dnsTransaction = getLatestTransaction(key)

  const startOrResumeFlow = () => {
    if (!item.started) {
      dispatch({ name: 'setStarted', selected })
    }

    if (resumable) {
      return resumeTransactionFlow(key)
    }

    return createTransactionFlow(key, {
      transactions,
      resumable: true,
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/import/${selected.name}`,
    })
  }
  const txCallback: UpdateCallback = useCallback(
    ({ action, status, key: cbKey }) => {
      if (action !== 'claimDnsName' && action !== 'importDnsName') return
      if (status !== 'confirmed') return
      if (cbKey !== key) return
      dispatch({ name: 'increaseStep', selected })
    },
    [dispatch, key, selected],
  )

  useCallbackOnTransaction(txCallback)

  useEffect(() => {
    /* eslint-disable @typescript-eslint/naming-convention */
    if (dnsTransaction?.stage === 'sent') {
      sendEvent('transaction:import:send', {
        ens_name: selected.name,
        type: dnsTransaction.name === 'claimDnsName' ? 'claim' : 'import',
        transaction_hash: dnsTransaction.hash,
      })
    } else if (dnsTransaction?.stage === 'complete') {
      sendEvent('transaction:import:complete', {
        ens_name: selected.name,
        type: dnsTransaction.name === 'claimDnsName' ? 'claim' : 'import',
        transaction_hash: dnsTransaction.hash,
      })
    } else if (dnsTransaction?.stage === 'failed') {
      sendEvent('transaction:import:fail', {
        ens_name: selected.name,
        type: dnsTransaction.name === 'claimDnsName' ? 'claim' : 'import',
        transaction_hash: dnsTransaction.hash,
      })
    }
    /* eslint-enable @typescript-eslint/naming-convention */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dnsTransaction?.stage])

  return (
    <DnsImportCard>
      {dnsOwnerStatus === 'mismatching' ? (
        <>
          <DnsImportHeading>{t('mismatching.title')}</DnsImportHeading>
          <Typography>
            <Trans t={t} i18nKey="mismatching.subtitle" components={{ b: <b /> }} />
          </Typography>
        </>
      ) : (
        <>
          <DnsImportHeading>{t('matching.title')}</DnsImportHeading>
          <Typography>{t('matching.subtitle')}</Typography>
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
          <Typography>{t('estimatedNetworkCost')}</Typography>
          <Typography data-testid="import-cost">
            <CurrencyText eth={gasCost} currency={currencyDisplay} />
          </Typography>
        </InvoiceItemBox>
        <InvoiceItemBox>
          <Typography>{tc('name.owner')}</Typography>
          {dnsOwner && <InvoiceDnsOwner dnsOwner={dnsOwner} />}
        </InvoiceItemBox>
      </InvoiceContainer>
      {dnsOwnerStatus === 'mismatching' && (
        <Helper alert="warning">
          {tc('steps.verifyOwnership.status.mismatching.error.onchain', { ns: 'dnssec' })}
        </Helper>
      )}
      <DnsImportActionsContainer>
        <DnsImportActionButton
          colorStyle="accentSecondary"
          onClick={() => dispatch({ name: 'decreaseStep', selected })}
        >
          {tc('action.back')}
        </DnsImportActionButton>
        <DnsImportActionButton
          disabled={!dnsOwner || isLoading || isRefetching || isError || gasCost === 0n}
          loading={isLoading || isEstimateLoading}
          onClick={() => startOrResumeFlow()}
          data-testid="import-next-button"
        >
          {dnsOwnerStatus === 'mismatching' ? tc('action.import') : tc('action.claim')}
        </DnsImportActionButton>
      </DnsImportActionsContainer>
    </DnsImportCard>
  )
}
