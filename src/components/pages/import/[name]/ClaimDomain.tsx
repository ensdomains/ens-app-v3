import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

import { getDnsImportData } from '@ensdomains/ensjs/dns'
import { Helper, Typography } from '@ensdomains/thorin2'

import BaseLink from '@app/components/@atoms/BaseLink'
import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useDnsImportData } from '@app/hooks/ensjs/dns/useDnsImportData'
import { useEstimateGasLimitForTransaction } from '@app/hooks/gasEstimation/useEstimateGasLimitForTransactions'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { usePublicClient } from '@app/hooks/usePublicClient'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import {
  CreateTransactionFlow,
  useTransactionFlow,
} from '@app/transaction-flow/TransactionFlowProvider'
import { PublicClientWithChain } from '@app/types'
import { shortenAddress } from '@app/utils/utils'

import {
  ButtonContainer,
  CheckButton,
  hasPendingTransaction,
  shouldShowSuccessPage,
} from './shared'
import { Steps } from './Steps'

const Container = styled.div`
  text-align: center;
`

const GreyBox = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.backgroundSecondary};
    border-radius: ${theme.radii.large};
    padding: ${theme.space['5']} ${theme.space['3.5']};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `,
)

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const NamePillContainer = styled.div(
  ({ theme }) => css`
    height: ${theme.space['9']};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const StyledTypography = styled(Typography)(
  ({ theme }) => css`
    a {
      color: ${theme.colors.blue};
    }
  `,
)

export const NamePillWithAddress = ({ name, address }: { name: string; address: string }) => {
  return (
    <NamePillContainer>
      <TextContainer>
        <Typography fontVariant="bodyBold">{name}</Typography>
        <Typography fontVariant="small" color="grey">
          {shortenAddress(address)}
        </Typography>
      </TextContainer>
      <AvatarWrapper>
        <NameAvatar label={name} name={name} />
      </AvatarWrapper>
    </NamePillContainer>
  )
}

const handleClaim =
  ({
    publicClient,
    name,
    createTransactionFlow,
    address,
  }: {
    publicClient: PublicClientWithChain
    name: string
    createTransactionFlow: CreateTransactionFlow
    address: Address
  }) =>
  async () => {
    const dnsImportData = await getDnsImportData(publicClient, { name })
    const timestamp = new Date().getTime()
    const transactionKey = `importName-${name}-${timestamp}`
    createTransactionFlow(transactionKey, {
      transactions: [
        makeTransactionItem('importDNSSECName', {
          name,
          dnsImportData,
          address,
        }),
      ],
    })
    localStorage.setItem('latestImportTransactionKey', transactionKey)
  }

export const ClaimDomain = ({
  syncWarning,
  setCurrentStep,
  name,
}: {
  syncWarning: boolean
  setCurrentStep: Dispatch<SetStateAction<number>>
  name: string
}) => {
  const { t } = useTranslation('dnssec')

  const publicClient = usePublicClient()
  const { address } = useAccount()

  const { createTransactionFlow } = useTransactionFlow()
  const transactions = useRecentTransactions()

  const [pendingTransaction, setPendingTransaction] = useState(false)

  const { data: dnsImportData } = useDnsImportData({ name })

  const gasEstimate = useEstimateGasLimitForTransaction({
    transaction: makeTransactionItem('importDNSSECName', {
      name,
      dnsImportData: dnsImportData!,
      address: syncWarning ? undefined : address!,
    }),
    enabled: !!dnsImportData,
  })

  useEffect(() => {
    if (hasPendingTransaction(transactions)) {
      setPendingTransaction(true)
      return
    }
    if (shouldShowSuccessPage(transactions)) {
      setPendingTransaction(false)
      setCurrentStep((x: number) => x + 1)
      return
    }
    setPendingTransaction(false)
  }, [setCurrentStep, transactions])

  return (
    <Container>
      <Typography fontVariant="extraLargeBold">{t('claimDomain.title')}</Typography>
      <Spacer height="$4" />
      <GreyBox>
        <Typography>{t('claimDomain.dnsOwner')}</Typography>
        <NamePillWithAddress name={name} address={address || ''} />
      </GreyBox>
      <Spacer height="$4" />
      <GreyBox>
        <Typography>{t('claimDomain.networkEst')}</Typography>
        <Typography>{gasEstimate?.gasCostEth?.toString()?.substring(0, 6)} ETH</Typography>
      </GreyBox>
      <Spacer height="$4" />
      {syncWarning ? (
        <Helper type="warning" style={{ textAlign: 'center' }}>
          <Typography>{t('claimDomain.syncWarning')}</Typography>
        </Helper>
      ) : (
        <Typography>{t('claimDomain.verifiedOwnership')}</Typography>
      )}
      {pendingTransaction && (
        <>
          <Spacer height="$5" />
          <Helper type="info" style={{ textAlign: 'center' }}>
            <StyledTypography>
              {t('claimDomain.pendingTransactionPre')}{' '}
              <BaseLink href="/my/settings">{t('claimDomain.pendingTransactionLink')}</BaseLink>{' '}
              {t('claimDomain.pendingTransactionPost')}
            </StyledTypography>
          </Helper>
        </>
      )}
      <Spacer height="$5" />
      <Steps
        {...{
          stepStatus: ['completed', 'completed', 'inProgress', 'notStarted'],
        }}
      />
      <Spacer height="$5" />
      <ButtonContainer>
        <CheckButton
          size="small"
          onClick={handleClaim({ publicClient, address: address!, createTransactionFlow, name })}
        >
          {t('action.claim', { ns: 'common' })}
        </CheckButton>
        <CheckButton
          colorStyle="accentSecondary"
          size="small"
          onClick={() => setCurrentStep((x) => x - 1)}
        >
          {t('action.back', { ns: 'common' })}
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
