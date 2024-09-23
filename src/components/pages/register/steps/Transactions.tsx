import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { Button, CountdownCircle, Dialog, Heading, mq, Spinner } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { TextWithTooltip } from '@app/components/@atoms/TextWithTooltip/TextWithTooltip'
import { Card } from '@app/components/Card'
import { useDurationCountdown } from '@app/hooks/time/useDurationCountdown'
import { useTransactionManager } from '@app/transaction/transactionManager'
import { CenteredTypography } from '@app/transaction/user/input/ProfileEditor/components/CenteredTypography'
import { ONE_DAY } from '@app/utils/time'

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
}

const Transactions = ({ name }: Props) => {
  const { t } = useTranslation('register')

  const commitTransaction = useTransactionManager((s) => s.getCurrentCommitTransaction(name))
  const registerTransaction = useTransactionManager((s) => s.getCurrentRegisterTransaction(name))

  const [resetOpen, setResetOpen] = useState(false)

  const commitTimestamp =
    commitTransaction?.status === 'success' ? commitTransaction?.receipt.timestamp : undefined
  const [commitComplete, setCommitComplete] = useState(
    !!commitTimestamp && commitTimestamp + 60000 < Date.now(),
  )

  const existingRegistrationData = useTransactionManager((s) =>
    s.getCurrentRegistrationFlowOrDefault(name),
  )
  const resetRegistrationTransactions = useTransactionManager(
    (s) => () => s.resetRegistrationTransactions(name),
  )
  const startCommitNameTransaction = useTransactionManager(
    (s) => () => s.startCommitNameTransaction(name),
  )
  const startRegisterNameTransaction = useTransactionManager(
    (s) => () => s.startRegisterNameTransaction(name),
  )
  const onRegistrationTransactionsStepCompleted = useTransactionManager(
    (s) => s.onRegistrationTransactionsStepCompleted,
  )
  const resumeCommitNameTransaction = useTransactionManager(
    (s) => () => s.resumeCommitNameTransaction(name),
  )
  const resumeRegisterNameTransaction = useTransactionManager(
    (s) => () => s.resumeRegisterNameTransaction(name),
  )

  // const commitCouldBeFound =
  //   !commitTransaction?.status || commitTransaction.status === 'empty' || commitTransaction.status === 'waitingForUser' || commitTransaction.status === 'reverted'
  // useExistingCommitment({
  //   commitment: makeCommitment(registrationParams),
  //   enabled: commitCouldBeFound,
  //   commitKey,
  // })

  // const makeCommitNameFlow = useCallback(() => {
  //   onStart()
  //   createTransactionFlow(commitKey, {
  //     transactions: [createTransactionItem('commitName', registrationParams)],
  //     requiresManualCleanup: true,
  //     autoClose: true,
  //     resumeLink: `/register/${name}`,
  //   })
  // }, [commitKey, createTransactionFlow, name, onStart, registrationParams])

  // const makeRegisterNameFlow = () => {
  //   createTransactionFlow(registerKey, {
  //     transactions: [createTransactionItem('registerName', registrationParams)],
  //     requiresManualCleanup: true,
  //     autoClose: true,
  //     resumeLink: `/register/${name}`,
  //   })
  // }

  const NormalBackButton = useMemo(
    () => (
      <MobileFullWidth>
        <Button
          onClick={() => onRegistrationTransactionsStepCompleted(name, { back: true })}
          colorStyle="accentSecondary"
        >
          {t('action.back', { ns: 'common' })}
        </Button>
      </MobileFullWidth>
    ),
    [t, name, onRegistrationTransactionsStepCompleted],
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

  const duration = useDurationCountdown({
    endDate: commitTimestamp ? new Date(commitTimestamp + ONE_DAY * 1000) : undefined,
  })

  const resetTransactions = () => {
    resetRegistrationTransactions()
    setResetOpen(false)
  }

  if (!commitTransaction) {
    startCommitNameTransaction()
  }

  useEffect(() => {
    if (!commitTransaction) {
      startCommitNameTransaction()
    }
  }, [commitTransaction, startCommitNameTransaction])

  useEffect(() => {
    if (registerTransaction?.status === 'success') {
      onRegistrationTransactionsStepCompleted(name, { back: false })
    }
  }, [registerTransaction?.status, onRegistrationTransactionsStepCompleted, name])

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
      <CenteredTypography>
        {match([commitTransaction, commitComplete, duration])
          .with([{ status: 'success' }, false, P._], () => (
            <Trans
              i18nKey="steps.transactions.subheading.commiting"
              t={t}
              components={{
                tooltip: (
                  <TextWithTooltip
                    tooltipContent={t('steps.transactions.subheading.frontRunning')}
                  />
                ),
              }}
            />
          ))
          .with([{ status: 'success' }, true, null], () =>
            t('steps.transactions.subheading.commitExpired'),
          )
          .with([{ status: 'success' }, true, P.not(P.nullish)], ([, , d]) =>
            t('steps.transactions.subheading.commitComplete', { duration: d }),
          )
          .with([{ status: 'success' }, true, P._], () =>
            t('steps.transactions.subheading.commitCompleteNoDuration'),
          )
          .otherwise(() => t('steps.transactions.subheading.default'))}
      </CenteredTypography>
      <ButtonContainer>
        {match([commitComplete, registerTransaction, commitTransaction])
          .with([true, { status: 'reverted' }, P._], () => (
            <>
              {ResetBackButton}
              <FailedButton
                label={t('steps.transactions.transactionFailed')}
                onClick={resumeRegisterNameTransaction}
              />
            </>
          ))
          .with([true, { status: 'pending' }, P._], () => (
            <ProgressButton
              label={t('steps.transactions.transactionProgress')}
              onClick={resumeRegisterNameTransaction}
            />
          ))
          .with([true, P._, P._], () => (
            <>
              {ResetBackButton}
              <MobileFullWidth>
                <Button
                  data-testid="finish-button"
                  onClick={
                    !registerTransaction
                      ? startRegisterNameTransaction
                      : resumeRegisterNameTransaction
                  }
                >
                  {t('action.finish', { ns: 'common' })}
                </Button>
              </MobileFullWidth>
            </>
          ))
          .with([false, P._, { status: 'reverted' }], () => (
            <>
              {NormalBackButton}
              <FailedButton
                label={t('steps.transactions.transactionFailed')}
                onClick={resumeCommitNameTransaction}
              />
            </>
          ))
          .with([false, P._, { status: 'pending' }], () => (
            <ProgressButton
              label={t('steps.transactions.transactionProgress')}
              onClick={resumeCommitNameTransaction}
            />
          ))
          .with([false, P._, { status: 'success' }], () => (
            <>
              {ResetBackButton}
              <MobileFullWidth>
                <Button data-testid="wait-button" disabled suffix={<Spinner color="greyPrimary" />}>
                  {t('steps.transactions.wait')}
                </Button>
              </MobileFullWidth>
            </>
          ))
          .otherwise(() => (
            <>
              <MobileFullWidth>
                <Button
                  onClick={() => onRegistrationTransactionsStepCompleted(name, { back: true })}
                  colorStyle="accentSecondary"
                >
                  {t('action.back', { ns: 'common' })}
                </Button>
              </MobileFullWidth>
              <MobileFullWidth>
                <Button data-testid="start-timer-button" onClick={startCommitNameTransaction}>
                  {t('steps.transactions.startTimer')}
                </Button>
              </MobileFullWidth>
            </>
          ))}
      </ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
