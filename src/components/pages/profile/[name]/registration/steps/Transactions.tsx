import { ReactNode, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { BaseRegistrationParams } from '@ensdomains/ensjs/utils/registerHelpers'
import { Button, CountdownCircle, Heading, Spinner, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { yearsToSeconds } from '@app/utils/utils'

import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const StyledCountdown = styled(CountdownCircle)(
  ({ theme, disabled }) => css`
    width: ${theme.space['52']};
    height: ${theme.space['52']};
    & > div {
      font-size: ${theme.fontSizes.headingOne};
      font-weight: ${theme.fontWeights.bold};
      width: ${theme.space['52']};
      height: ${theme.space['52']};
      color: ${theme.colors.accent};
      ${disabled &&
      css`
        color: ${theme.colors.grey};
      `}
    }
    svg {
      stroke-width: ${theme.space['0.5']};
      ${disabled &&
      css`
        stroke: ${theme.colors.grey};
      `}
    }
  `,
)

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
  onStart: () => void
}

const Transactions = ({ registrationData, nameDetails, callback, onStart }: Props) => {
  const { address } = useAccount()
  const keySuffix = `${nameDetails.normalisedName}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction, createTransactionFlow, resumeTransactionFlow } =
    useTransactionFlow()
  const commitTx = getLatestTransaction(commitKey)
  const registerTx = getLatestTransaction(registerKey)

  const commitTimestamp = commitTx?.stage === 'complete' ? commitTx?.finaliseTime : undefined
  const [commitComplete, setCommitComplete] = useState(
    commitTimestamp && commitTimestamp + 60000 < Date.now(),
  )

  useEffect(() => {
    if (registerTx?.stage === 'complete') {
      callback({ back: false })
    }
  }, [callback, registerTx?.stage])

  const registrationParams: BaseRegistrationParams & { name: string } = useMemo(
    () => ({
      name: nameDetails.normalisedName,
      owner: address!,
      duration: yearsToSeconds(registrationData.years),
      resolverAddress: registrationData.resolver,
      secret: registrationData.secret,
      fuses: registrationData.permissions,
      records: registrationData.records,
      reverseRecord: registrationData.reverseRecord,
    }),
    [address, nameDetails, registrationData],
  )

  const makeCommitNameFlow = () => {
    onStart()
    createTransactionFlow(commitKey, {
      transactions: [makeTransactionItem('commitName', registrationParams)],
      requiresManualCleanup: true,
    })
  }

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [makeTransactionItem('registerName', registrationParams)],
      requiresManualCleanup: true,
    })
  }

  const showCommitTransaction = () => {
    resumeTransactionFlow(commitKey)
  }

  let Buttons: ReactNode = (
    <>
      <MobileFullWidth>
        <Button shadowless onClick={() => callback({ back: true })} variant="secondary">
          Back
        </Button>
      </MobileFullWidth>
      <MobileFullWidth>
        <Button shadowless onClick={makeCommitNameFlow}>
          Start timer
        </Button>
      </MobileFullWidth>
    </>
  )

  if (commitComplete) {
    Buttons = (
      <MobileFullWidth>
        <Button shadowless onClick={makeRegisterNameFlow}>
          Finish
        </Button>
      </MobileFullWidth>
    )
  } else if (commitTx?.stage) {
    if (commitTx?.stage === 'failed') {
      Buttons = (
        <MobileFullWidth>
          <Button shadowless tone="red" onClick={showCommitTransaction}>
            Transaction Failed
          </Button>
        </MobileFullWidth>
      )
    } else if (commitTx?.stage === 'sent') {
      Buttons = (
        <MobileFullWidth>
          <Button shadowless variant="secondary" onClick={showCommitTransaction}>
            Transaction in progress
          </Button>
        </MobileFullWidth>
      )
    } else if (commitTx?.stage === 'complete') {
      Buttons = (
        <MobileFullWidth>
          <Button shadowless disabled suffix={<Spinner color="background" />}>
            Wait
          </Button>
        </MobileFullWidth>
      )
    }
  }

  return (
    <StyledCard>
      <Heading>Almost there</Heading>
      <StyledCountdown
        countdownSeconds={60}
        disabled={!commitTimestamp}
        startTimestamp={commitTimestamp}
        size="large"
        callback={() => setCommitComplete(true)}
      />
      <Typography>This timer prevents others from registering this name before you do.</Typography>
      <ButtonContainer>{Buttons}</ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
