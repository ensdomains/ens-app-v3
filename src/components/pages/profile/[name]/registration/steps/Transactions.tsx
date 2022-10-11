import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const FailedButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button shadowless tone="red" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

const ProgressButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button shadowless variant="secondary" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

const Transactions = ({ registrationData, nameDetails, callback, onStart }: Props) => {
  const { t } = useTranslation('register')

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

  const makeCommitNameFlow = useCallback(() => {
    onStart()
    createTransactionFlow(commitKey, {
      transactions: [makeTransactionItem('commitName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
    })
  }, [commitKey, createTransactionFlow, onStart, registrationParams])

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [makeTransactionItem('registerName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
    })
  }

  const showCommitTransaction = () => {
    resumeTransactionFlow(commitKey)
  }

  const showRegisterTransaction = () => {
    resumeTransactionFlow(registerKey)
  }

  useEffect(() => {
    if (!commitTx) {
      makeCommitNameFlow()
    }
  }, [commitTx, makeCommitNameFlow])

  useEffect(() => {
    if (registerTx?.stage === 'complete') {
      callback({ back: false })
    }
  }, [callback, registerTx?.stage])

  let Buttons: ReactNode = (
    <>
      <MobileFullWidth>
        <Button shadowless onClick={() => callback({ back: true })} variant="secondary">
          {t('action.back', { ns: 'common' })}
        </Button>
      </MobileFullWidth>
      <MobileFullWidth>
        <Button data-testid="start-timer-button" shadowless onClick={makeCommitNameFlow}>
          {t('steps.transactions.startTimer')}
        </Button>
      </MobileFullWidth>
    </>
  )

  if (commitComplete) {
    if (registerTx?.stage === 'failed') {
      Buttons = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showRegisterTransaction}
        />
      )
    } else if (registerTx?.stage === 'sent') {
      Buttons = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showRegisterTransaction}
        />
      )
    } else {
      Buttons = (
        <MobileFullWidth>
          <Button
            data-testid="finish-button"
            shadowless
            onClick={!registerTx ? makeRegisterNameFlow : showRegisterTransaction}
          >
            {t('action.finish', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
      )
    }
  } else if (commitTx?.stage) {
    if (commitTx?.stage === 'failed') {
      Buttons = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'sent') {
      Buttons = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'complete') {
      Buttons = (
        <MobileFullWidth>
          <Button
            data-testid="wait-button"
            shadowless
            disabled
            suffix={<Spinner color="background" />}
          >
            {t('steps.transactions.wait')}
          </Button>
        </MobileFullWidth>
      )
    }
  }

  return (
    <StyledCard>
      <Heading>{t('steps.transactions.heading')}</Heading>
      <StyledCountdown
        countdownSeconds={60}
        disabled={!commitTimestamp}
        startTimestamp={commitTimestamp}
        size="large"
        callback={() => setCommitComplete(true)}
      />
      <Typography>{t('steps.transactions.subheading')}</Typography>
      <ButtonContainer>{Buttons}</ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
