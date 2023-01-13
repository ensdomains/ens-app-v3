import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useQuery } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Helper, Typography } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useEstimateGasLimitForTransactions } from '@app/hooks/useEstimateGasLimitForTransactions'
import {
  CreateTransactionFlow,
  useTransactionFlow,
} from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { emptyAddress } from '@app/utils/constants'
import { shortenAddress } from '@app/utils/utils'

import { Steps } from './Steps'
import {
  ButtonContainer,
  CheckButton,
  hasPendingTransaction,
  shouldShowSuccessPage,
} from './shared'
import { DNS_OVER_HTTP_ENDPOINT } from './utils'

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

export const NamePillWithAddress = ({
  name,
  network,
  address,
}: {
  name: string
  network: number
  address: string
}) => {
  return (
    <NamePillContainer>
      <TextContainer>
        <Typography {...{ weight: 'bold' }}>{name}</Typography>
        <Typography {...{ variant: 'small', weight: 'light', color: 'textTertiary' }}>
          {shortenAddress(address)}
        </Typography>
      </TextContainer>
      <AvatarWrapper>
        <NameAvatar label={name} name={name} network={network} />
      </AvatarWrapper>
    </NamePillContainer>
  )
}

const handleClaim =
  (name: string, createTransactionFlow: CreateTransactionFlow, address: string) => async () => {
    const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
    const result = await prover.queryWithProof('TXT', `_ens.${name}`)
    const timestamp = new Date().getTime()
    const transactionKey = `importName-${name}-${timestamp}`
    createTransactionFlow(transactionKey, {
      transactions: [
        makeTransactionItem('importDNSSECName', {
          name,
          proverResult: result,
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
  const { address } = useAccount()
  const { createTransactionFlow } = useTransactionFlow()
  const transactions = useRecentTransactions()
  const [pendingTransaction, setPendingTransaction] = useState(false)
  const { t } = useTranslation('dnssec')

  const { data: proverResult } = useQuery([`proverResult`, name, syncWarning], async () => {
    if (name) {
      const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
      const result = await prover.queryWithProof('TXT', `_ens.${name}`)
      return result
    }
  })

  const gasEstimate = useEstimateGasLimitForTransactions(
    [
      makeTransactionItem(`importDNSSECName`, {
        name,
        proverResult,
        address: syncWarning ? emptyAddress : address!,
      }),
    ],
    !!proverResult,
    [syncWarning?.toString()],
  )

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
      <Typography {...{ variant: 'extraLarge', weight: 'bold' }}>
        {t('claimDomain.title')}
      </Typography>
      <Spacer $height="4" />
      <GreyBox>
        <Typography>{t('claimDomain.dnsOwner')}</Typography>
        <NamePillWithAddress name={name} network={1} address={address || ''} />
      </GreyBox>
      <Spacer $height="4" />
      <GreyBox>
        <Typography>{t('claimDomain.networkEst')}</Typography>
        <Typography>{gasEstimate?.gasCostEth?.toString()?.substring(0, 6)} ETH</Typography>
      </GreyBox>
      <Spacer $height="4" />
      {syncWarning ? (
        <Helper type="warning" style={{ textAlign: 'center' }}>
          <Typography>{t('claimDomain.syncWarning')}</Typography>
        </Helper>
      ) : (
        <Typography>{t('claimDomain.verifiedOwnership')}</Typography>
      )}
      {pendingTransaction && (
        <>
          <Spacer $height="5" />
          <Helper type="info" style={{ textAlign: 'center' }}>
            <StyledTypography>
              {t('claimDomain.pendingTransactionPre')}{' '}
              <BaseLink href="/my/settings">{t('claimDomain.pendingTransactionLink')}</BaseLink>{' '}
              {t('claimDomain.pendingTransactionPost')}
            </StyledTypography>
          </Helper>
        </>
      )}
      <Spacer $height="5" />
      <Steps
        {...{
          stepStatus: ['completed', 'completed', 'inProgress', 'notStarted'],
        }}
      />
      <Spacer $height="5" />
      <ButtonContainer>
        <CheckButton
          variant="primary"
          size="small"
          onClick={handleClaim(name, createTransactionFlow, syncWarning ? emptyAddress : address!)}
        >
          {t('action.claim', { ns: 'common' })}
        </CheckButton>
        <CheckButton
          shadowless
          variant="secondary"
          size="small"
          onClick={() => setCurrentStep((x) => x - 1)}
        >
          {t('action.back', { ns: 'common' })}
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
