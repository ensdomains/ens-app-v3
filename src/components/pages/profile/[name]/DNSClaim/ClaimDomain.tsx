import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Button, Helper, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { emptyAddress } from '@app/utils/constants'
import { shortenAddress } from '@app/utils/utils'

import { Steps } from './Steps'
import { ButtonContainer, CheckButton } from './shared'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

const GreyBox = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.backgroundSecondary};
    border-radius: 10px;
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
  `,
)

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

export const DNS_OVER_HTTP_ENDPOINT = 'https://1.1.1.1/dns-query'

const handleClaim = (name, createTransactionFlow, address) => async () => {
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

export const ClaimDomain = ({ syncWarning, currentStep, setCurrentStep }) => {
  const router = useRouter()
  const { address } = useAccount()
  const { createTransactionFlow, getTransaction } = useTransactionFlow()
  const transactions = useRecentTransactions()
  const [pendingTransaction, setPendingTransaction] = useState(false)

  const name = router.query.name as string

  useEffect(() => {
    const transactionKey = localStorage.getItem('latestImportTransactionKey')

    const transaction = transactions.find((transaction) => {
      const description = JSON.parse(transaction.description)
      return description.key === transactionKey
    })

    if (transaction && transaction.status === 'pending') {
      setPendingTransaction(true)
      return
    }

    if (transaction && transaction.status === 'confirmed') {
      setPendingTransaction(false)
      setCurrentStep((x) => x + 1)
      return
    }

    setPendingTransaction(false)
  }, [transactions])

  return (
    <Container>
      <Typography>Claim your domain</Typography>
      <Spacer $height="4" />
      {syncWarning ? (
        <Helper type="warning" style={{ textAlign: 'center' }}>
          <Typography>You are importing a DNS name that you appear to not own.</Typography>
        </Helper>
      ) : (
        <Typography>You have verified your ownership and can claim this domain.</Typography>
      )}
      {pendingTransaction && (
        <>
          <Spacer $height="4" />
          <Helper type="info" style={{ textAlign: 'center' }}>
            <StyledTypography>
              You already have a <Link href="/my/settings">pending transaction</Link> for this name
            </StyledTypography>
          </Helper>
        </>
      )}
      <Spacer $height="4" />
      <GreyBox>
        <Typography>DNS Owner</Typography>
        <NamePillWithAddress name={name} label={`${name}-avatar`} network={1} address={address} />
      </GreyBox>
      <Spacer $height="4" />
      <GreyBox>
        <Typography>Estimated network cost</Typography>
        <Typography>000.4 ETH</Typography>
      </GreyBox>
      <Spacer $height="5" />
      <Steps
        {...{
          currentStep,
          stepStatus: ['complete', 'complete', 'inProgress', 'notStarted'],
        }}
      />
      <Spacer $height="5" />
      <ButtonContainer>
        <CheckButton
          variant="primary"
          size="small"
          onClick={handleClaim(name, createTransactionFlow, syncWarning ? emptyAddress : address)}
        >
          Claim
        </CheckButton>
        <CheckButton variant="primary" size="small">
          Back
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
