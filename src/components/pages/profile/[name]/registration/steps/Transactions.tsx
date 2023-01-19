import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { BaseRegistrationParams } from '@ensdomains/ensjs/utils/registerHelpers'
import {
  AlertSVG,
  Button,
  CountdownCircle,
  Dialog,
  Heading,
  Spinner,
  Typography,
  mq,
} from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { yearsToSeconds } from '@app/utils/utils'

import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
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

const DialogTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;
  `,
)

const DialogHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};

    div:first-of-type {
      padding: ${theme.space['2']};
      background-color: ${theme.colors.yellow};
      color: ${theme.colors.background};
      border-radius: ${theme.radii.full};

      svg {
        display: block;
        overflow: visible;
      }
    }
  `,
)

const DialogContent = styled(Typography)(
  () => css`
    text-align: center;
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
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean; resetSecret?: boolean }) => void
  onStart: () => void
}

const Transactions = ({ registrationData, nameDetails, callback, onStart }: Props) => {
  const { t } = useTranslation('register')

  const { address } = useAccount()
  const keySuffix = `${nameDetails.normalisedName}-${address}`
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
      resumeLink: `/register/${nameDetails.normalisedName}`,
    })
  }, [commitKey, createTransactionFlow, nameDetails.normalisedName, onStart, registrationParams])

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [makeTransactionItem('registerName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${nameDetails.normalisedName}`,
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
        <InnerDialog>
          <DialogHeading>
            <div>
              <AlertSVG />
            </div>
            <DialogTitle>You will lose your transaction</DialogTitle>
          </DialogHeading>
          <DialogContent>
            Going back will reset your first transaction. If you go back you will need to complete
            the transaction again and pay the associated fees.
          </DialogContent>
          <DialogContent>Are you sure you want to continue?</DialogContent>
          <Dialog.Footer
            trailing={
              <Button onClick={resetTransactions} colorStyle="redSecondary">
                Reset transaction and go back
              </Button>
            }
          />
        </InnerDialog>
      </Dialog>
      <Heading>{t('steps.transactions.heading')}</Heading>
      <StyledCountdown
        countdownSeconds={60}
        disabled={!commitTimestamp}
        startTimestamp={commitTimestamp}
        size="large"
        callback={() => setCommitComplete(true)}
      />
      <Typography>{t('steps.transactions.subheading')}</Typography>
      <ButtonContainer>
        {BackButton}
        {ActionButton}
      </ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
