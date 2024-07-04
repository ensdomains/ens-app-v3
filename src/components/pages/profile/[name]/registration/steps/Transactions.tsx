import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { makeCommitment } from '@ensdomains/ensjs/utils'
import { Button, CountdownCircle, Dialog, Heading, mq, Spinner } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useExistingCommitment } from '@app/hooks/registration/useExistingCommitment'
import useRegistrationParams from '@app/hooks/useRegistrationParams'
import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { RegistrationReducerDataItem } from '../types'

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

const FailedButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button color="red" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

const ProgressButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button colorStyle="accentSecondary" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

type Props = {
  name: string
  registrationData: RegistrationReducerDataItem
  callback: (data: { back: boolean; resetSecret?: boolean }) => void
  onStart: () => void
}

const Transactions = ({ registrationData, name, callback, onStart }: Props) => {
  const { t } = useTranslation('register')

  const { address } = useAccount()
  const keySuffix = `${name}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction, createTransactionFlow, resumeTransactionFlow, cleanupFlow } =
    useTransactionFlow()
  const commitTx = getLatestTransaction(commitKey)
  const registerTx = getLatestTransaction(registerKey)
  const [resetOpen, setResetOpen] = useState(false)

  const commitTimestamp = commitTx?.stage === 'complete' ? commitTx?.finaliseTime : undefined
  const [commitComplete, setCommitComplete] = useState(
    commitTimestamp && commitTimestamp + 60000 < Date.now(),
  )

  const registrationParams = useRegistrationParams({
    name,
    owner: address!,
    registrationData,
  })

  const commitCouldBeFound =
    !commitTx?.stage || commitTx.stage === 'confirm' || commitTx.stage === 'failed'
  useExistingCommitment({
    commitment: makeCommitment(registrationParams),
    enabled: commitCouldBeFound,
    commitKey,
  })

  const makeCommitNameFlow = useCallback(() => {
    onStart()
    createTransactionFlow(commitKey, {
      transactions: [createTransactionItem('commitName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${name}`,
    })
  }, [commitKey, createTransactionFlow, name, onStart, registrationParams])

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [createTransactionItem('registerName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${name}`,
    })
  }

  const showCommitTransaction = () => {
    resumeTransactionFlow(commitKey)
  }

  const showRegisterTransaction = () => {
    resumeTransactionFlow(registerKey)
  }

  const resetTransactions = () => {
    cleanupFlow(commitKey)
    cleanupFlow(registerKey)
    callback({ back: true, resetSecret: true })
    setResetOpen(false)
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

  const NormalBackButton = useMemo(
    () => (
      <MobileFullWidth>
        <Button onClick={() => callback({ back: true })} colorStyle="accentSecondary">
          {t('action.back', { ns: 'common' })}
        </Button>
      </MobileFullWidth>
    ),
    [t, callback],
  )

  const ResetBackButton = useMemo(
    () => (
      <div>
        <Button colorStyle="redSecondary" onClick={() => setResetOpen(true)}>
          {t('action.back', { ns: 'common' })}
        </Button>
      </div>
    ),
    [t],
  )

  let BackButton: ReactNode = (
    <MobileFullWidth>
      <Button onClick={() => callback({ back: true })} colorStyle="accentSecondary">
        {t('action.back', { ns: 'common' })}
      </Button>
    </MobileFullWidth>
  )

  let ActionButton: ReactNode = (
    <MobileFullWidth>
      <Button data-testid="start-timer-button" onClick={makeCommitNameFlow}>
        {t('steps.transactions.startTimer')}
      </Button>
    </MobileFullWidth>
  )

  if (commitComplete) {
    if (registerTx?.stage === 'failed') {
      BackButton = ResetBackButton
      ActionButton = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showRegisterTransaction}
        />
      )
    } else if (registerTx?.stage === 'sent') {
      BackButton = null
      ActionButton = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showRegisterTransaction}
        />
      )
    } else {
      BackButton = ResetBackButton
      ActionButton = (
        <MobileFullWidth>
          <Button
            data-testid="finish-button"
            onClick={!registerTx ? makeRegisterNameFlow : showRegisterTransaction}
          >
            {t('action.finish', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
      )
    }
  } else if (commitTx?.stage) {
    if (commitTx?.stage === 'failed') {
      BackButton = NormalBackButton
      ActionButton = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'sent') {
      BackButton = null
      ActionButton = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'complete') {
      BackButton = ResetBackButton
      ActionButton = (
        <MobileFullWidth>
          <Button data-testid="wait-button" disabled suffix={<Spinner color="greyPrimary" />}>
            {t('steps.transactions.wait')}
          </Button>
        </MobileFullWidth>
      )
    }
  }

  return (
    <StyledCard>
      <Dialog variant="blank" open={resetOpen} onDismiss={() => setResetOpen(false)}>
        <Dialog.CloseButton onClick={() => setResetOpen(false)} />
        <Dialog.Heading
          title={t('steps.cancelRegistration.heading')}
          fontVariant="headingThree"
          alert="warning"
        />
        <Dialog.Content>
          <CenteredTypography>{t('steps.cancelRegistration.contentOne')}</CenteredTypography>
          <CenteredTypography>{t('steps.cancelRegistration.contentTwo')}</CenteredTypography>
        </Dialog.Content>
        <Dialog.Footer
          trailing={
            <Button onClick={resetTransactions} colorStyle="redSecondary">
              {t('steps.cancelRegistration.footer')}
            </Button>
          }
        />
      </Dialog>
      <Heading>{t('steps.transactions.heading')}</Heading>
      <StyledCountdown
        countdownSeconds={60}
        disabled={!commitTimestamp}
        startTimestamp={commitTimestamp}
        size="large"
        callback={() => setCommitComplete(true)}
      />
      <CenteredTypography>{t('steps.transactions.subheading')}</CenteredTypography>
      <ButtonContainer>
        {BackButton}
        {ActionButton}
      </ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
