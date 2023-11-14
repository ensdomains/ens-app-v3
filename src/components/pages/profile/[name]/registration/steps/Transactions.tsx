import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Card } from '@ensdomains/thorin'
import {
  AlertSVG,
  CountdownCircle,
  Dialog,
  Heading,
  Spinner,
  Typography,
} from '@ensdomains/thorin2'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useRegistrationParams from '@app/hooks/useRegistrationParams'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { RegistrationReducerDataItem } from '../types'

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
    text-align: center;
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
  <Button
    color="red"
    onClick={onClick}
    width={{ base: '$full', sm: '$fit' }}
    minWidth={{ sm: '$40' }}
    maxWidth={{ base: '$full', sm: '$fit' }}
  >
    {label}
  </Button>
)

const ProgressButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <Button
    colorStyle="accentSecondary"
    onClick={onClick}
    width={{ base: '$full', sm: '$fit' }}
    minWidth={{ sm: '$40' }}
    maxWidth={{ base: '$full', sm: '$fit' }}
  >
    {label}
  </Button>
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

  const makeCommitNameFlow = useCallback(() => {
    onStart()
    createTransactionFlow(commitKey, {
      transactions: [makeTransactionItem('commitName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${name}`,
    })
  }, [commitKey, createTransactionFlow, name, onStart, registrationParams])

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [makeTransactionItem('registerName', registrationParams)],
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
      <Button
        onClick={() => callback({ back: true })}
        colorStyle="accentSecondary"
        width={{ base: '$full', sm: '$fit' }}
        minWidth={{ sm: '$40' }}
        maxWidth={{ base: '$full', sm: '$fit' }}
      >
        {t('action.back', { ns: 'common' })}
      </Button>
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
    <Button
      onClick={() => callback({ back: true })}
      colorStyle="accentSecondary"
      width={{ base: '$full', sm: '$fit' }}
      minWidth={{ sm: '$40' }}
      maxWidth={{ base: '$full', sm: '$fit' }}
    >
      {t('action.back', { ns: 'common' })}
    </Button>
  )

  let ActionButton: ReactNode = (
    <Button
      data-testid="start-timer-button"
      onClick={makeCommitNameFlow}
      width={{ base: '$full', sm: '$fit' }}
      minWidth={{ sm: '$40' }}
      maxWidth={{ base: '$full', sm: '$fit' }}
    >
      {t('steps.transactions.startTimer')}
    </Button>
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
        <Button
          data-testid="finish-button"
          onClick={!registerTx ? makeRegisterNameFlow : showRegisterTransaction}
          width={{ base: '$full', sm: '$fit' }}
          minWidth={{ sm: '$40' }}
          maxWidth={{ base: '$full', sm: '$fit' }}
        >
          {t('action.finish', { ns: 'common' })}
        </Button>
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
        <Button
          data-testid="wait-button"
          disabled
          suffix={<Spinner color="greyPrimary" />}
          width={{ base: '$full', sm: '$fit' }}
          minWidth={{ sm: '$40' }}
          maxWidth={{ base: '$full', sm: '$fit' }}
        >
          {t('steps.transactions.wait')}
        </Button>
      )
    }
  }

  return (
    <Card maxWidth="780px" alignItems="center" margin="0 auto" px={{ base: '$4', sm: '$18' }}>
      <Dialog variant="blank" open={resetOpen} onDismiss={() => setResetOpen(false)}>
        <Dialog.CloseButton onClick={() => setResetOpen(false)} />
        <InnerDialog>
          <DialogHeading>
            <div>
              <AlertSVG />
            </div>
            <DialogTitle>{t('steps.cancelRegistration.heading')}</DialogTitle>
          </DialogHeading>
          <DialogContent>{t('steps.cancelRegistration.contentOne')}</DialogContent>
          <DialogContent>{t('steps.cancelRegistration.contentTwo')}</DialogContent>
          <Dialog.Footer
            trailing={
              <Button onClick={resetTransactions} colorStyle="redSecondary">
                {t('steps.cancelRegistration.footer')}
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
    </Card>
  )
}

export default Transactions
