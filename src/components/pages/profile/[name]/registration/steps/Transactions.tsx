import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { makeCommitment, makeLegacyCommitment } from '@ensdomains/ensjs/utils'
import { Button, CountdownCircle, Dialog, Heading, Spinner } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { StatusDots } from '@app/components/@atoms/StatusDots/StatusDots'
import { TextWithTooltip } from '@app/components/@atoms/TextWithTooltip/TextWithTooltip'
import { Card } from '@app/components/Card'
import { useCheckRegistered } from '@app/hooks/registration/useCheckRegistered'
import { useExistingCommitment } from '@app/hooks/registration/useExistingCommitment'
import { useSimulateRegistration } from '@app/hooks/registration/useSimulateRegistration'
import { useDurationCountdown } from '@app/hooks/time/useDurationCountdown'
import useRegistrationParams from '@app/hooks/useRegistrationParams'
import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { sendEvent } from '@app/utils/analytics/events'
import { isLegacyRegistration } from '@app/utils/registration/isLegacyRegistration'
import { makeLegacyRegistrationParams } from '@app/utils/registration/makeLegacyRegistrationParams'
import { ONE_DAY } from '@app/utils/time'

import { RegistrationReducerDataItem } from '../types'

const PATTERNS = {
  RegistrationComplete: {
    commitComplete: P._,
    canRegisterOverride: P._,
    commitStage: P._,
    registerStage: 'complete',
  },
  RegistrationFailed: {
    commitComplete: P._,
    canRegisterOverride: P._,
    commitStage: P._,
    registerStage: 'failed',
  },
  RegistrationSent: {
    commitComplete: P._,
    canRegisterOverride: P._,
    commitStage: P._,
    registerStage: 'sent',
  },
  RegistrationReady: {
    commitComplete: true,
    canRegisterOverride: P._,
    commitStage: P._,
    registerStage: P.union(P.nullish, 'confirm' as const),
  },
  RegistrationOverriden: {
    commitComplete: P._,
    canRegisterOverride: true,
    commitStage: P._,
    registerStage: P.union(P.nullish, 'confirm' as const),
  },
  CommitFailed: {
    commitComplete: P._,
    canRegisterOverride: P._,
    commitStage: 'failed',
    registerStage: P._,
  },
  CommitComplete: {
    commitComplete: false,
    canRegisterOverride: P._,
    commitStage: 'complete',
    registerStage: P.union(P.nullish, 'confirm' as const),
  },
  CommitSent: {
    commitComplete: false,
    canRegisterOverride: false,
    commitStage: 'sent',
    registerStage: P.union(P.nullish, 'confirm' as const),
  },
  CommitReady: {
    commitComplete: false,
    canRegisterOverride: false,
    commitStage: P.union(P.nullish, 'confirm' as const),
    registerStage: P.union(P.nullish, 'confirm' as const),
  },
} as const

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
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

const CountdownContainer = styled.div(
  () => css`
    position: relative;
  `,
)

const StyledCountdown = styled.div<{ disabled: boolean; complete: boolean }>(
  ({ theme, disabled, complete }) => css`
    width: ${theme.space['52']};
    height: ${theme.space['52']};

    div > div {
      font-size: ${theme.fontSizes.headingOne};
      font-weight: ${theme.fontWeights.bold};
      width: ${theme.space['52']};
      height: ${theme.space['52']};
      color: ${theme.colors.accent};
      ${disabled &&
      css`
        color: ${theme.colors.border};
      `}
    }

    circle {
      stroke: ${theme.colors.accentPrimary};
      ${disabled &&
      css`
        stroke: ${theme.colors.border};
      `}
    }

    svg > circle:nth-child(2) {
      stroke-width: ${theme.space['0.5']};
    }

    svg > circle:nth-child(1) {
      stroke-width: ${complete ? theme.space['0'] : theme.space['0.5']};
    }

    svg {
      stroke-width: ${theme.space['0.5']};
      stroke: ${theme.colors.accentPrimary};
      ${disabled &&
      css`
        stroke: ${theme.colors.border};
      `}
    }

    svg#countdown-complete-check {
      width: ${theme.space['16']};
      height: ${theme.space['16']};
      stroke: initial;
    }
  `,
)

const CountDownInner = styled.div<{ $hide: boolean }>(
  ({ theme, $hide }) => css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background-color: ${theme.colors.background};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radii.full};
    opacity: ${$hide ? 0 : 1};
    transition: opacity 0.3s ease-in-out;
  `,
)

const FailedButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button colorStyle="redPrimary" onClick={onClick}>
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
  const {
    getSelectedKey,
    getLatestTransaction,
    createTransactionFlow,
    resumeTransactionFlow,
    cleanupFlow,
    stopCurrentFlow,
  } = useTransactionFlow()
  const commitTx = getLatestTransaction(commitKey)
  const registerTx = getLatestTransaction(registerKey)
  const [resetOpen, setResetOpen] = useState(false)

  const registrationParams = useRegistrationParams({
    name,
    owner: address!,
    registrationData,
  })

  const { isSuccess: isSimulateRegistrationSuccess } = useSimulateRegistration({
    registrationParams,
    query: {
      enabled: commitTx?.stage === 'sent',
      retry: commitTx?.stage === 'sent',
      retryDelay: 5_000,
    },
  })
  const canRegisterOverride = isSimulateRegistrationSuccess && commitTx?.stage !== 'complete'

  const checkRegistered = useCheckRegistered({
    name,
    ownerAddress: address,
    enabled: registerTx?.stage === 'sent',
  })

  useEffect(() => {
    if (canRegisterOverride) {
      sendEvent('transaction:register:override', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: name,
      })
      if (getSelectedKey() === commitKey) stopCurrentFlow()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRegisterOverride])

  const commitTimestamp = match({ commitStage: commitTx?.stage, canRegisterOverride })
    .with({ canRegisterOverride: true }, () => Date.now() - 70_000)
    .with({ commitStage: 'complete' }, () => commitTx?.finaliseTime)
    .otherwise(() => undefined)

  const [commitComplete, setCommitComplete] = useState(
    !!commitTimestamp && commitTimestamp + 60000 < Date.now(),
  )

  const commitCouldBeFound =
    !commitTx?.stage || commitTx.stage === 'confirm' || commitTx.stage === 'failed'
  const isLegacyCommit = isLegacyRegistration(registrationParams)
  useExistingCommitment({
    registrationParams,
    commitment: isLegacyCommit
      ? makeLegacyCommitment(makeLegacyRegistrationParams(registrationParams))
      : makeCommitment(registrationParams),
    isLegacyCommit,
    enabled: commitCouldBeFound,
    commitKey,
  })

  const transactionState = match({
    commitComplete,
    canRegisterOverride,
    commitStage: commitTx?.stage,
    registerStage: registerTx?.stage,
  })
    .with(PATTERNS.RegistrationComplete, () => 'registrationComplete' as const)
    .with(PATTERNS.RegistrationFailed, () => 'registrationFailed' as const)
    .with(PATTERNS.RegistrationSent, () => 'registrationSent' as const)
    .with(PATTERNS.RegistrationOverriden, () => 'registrationOverriden' as const)
    .with(PATTERNS.RegistrationReady, () => 'registrationReady' as const)
    .with(PATTERNS.CommitFailed, () => 'commitFailed' as const)
    .with(PATTERNS.CommitComplete, () => 'commitComplete' as const)
    .with(PATTERNS.CommitSent, () => 'commitSent' as const)
    .with(PATTERNS.CommitReady, () => 'commitReady' as const)
    .exhaustive()

  useEffect(() => {
    match(transactionState)
      .with('commitSent', () => {
        sendEvent('transaction:commit:send', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: commitTx?.hash,
        })
      })
      .with('commitFailed', () => {
        sendEvent('transaction:commit:fail', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: commitTx?.hash,
        })
      })
      .with('commitComplete', () => {
        sendEvent('transaction:commit:complete', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: commitTx?.hash,
        })
      })
      .with('registrationSent', () => {
        sendEvent('transaction:register:send', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: registerTx?.hash,
        })
      })
      .with('registrationFailed', () => {
        sendEvent('transaction:register:fail', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: registerTx?.hash,
        })
      })
      .with('registrationComplete', () => {
        sendEvent('transaction:register:complete', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          transaction_hash: registerTx?.hash,
        })
      })
      .otherwise(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState])

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
    sendEvent('register:transaction_reset', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ens_name: name,
    })
    setResetOpen(false)
  }

  useEffect(() => {
    if (!commitTx) {
      makeCommitNameFlow()
    }
  }, [commitTx, makeCommitNameFlow])

  useEffect(() => {
    if (registerTx?.stage === 'complete' || checkRegistered) {
      stopCurrentFlow()
      callback({ back: false })
    }
  }, [callback, registerTx?.stage, checkRegistered])

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

  const duration = useDurationCountdown({
    endDate: commitTimestamp ? new Date(commitTimestamp + ONE_DAY * 1000) : undefined,
  })

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
      <CountdownContainer>
        <StyledCountdown
          disabled={match(transactionState)
            .with('commitReady', 'commitSent', 'commitFailed', () => true)
            .otherwise(() => false)}
          complete={commitComplete}
        >
          <CountdownCircle
            countdownSeconds={60}
            disabled={match(transactionState)
              .with('commitReady', 'commitSent', 'commitFailed', () => true)
              .otherwise(() => false)}
            startTimestamp={commitTimestamp}
            size="large"
            callback={() => setCommitComplete(true)}
          />
        </StyledCountdown>
        <CountDownInner
          $hide={match(transactionState)
            .with('commitComplete', 'registrationOverriden', () => true)
            .with(
              'registrationReady',
              () => duration !== null,
              () => true,
            )
            .otherwise(() => false)}
        >
          <StatusDots
            animate={match(transactionState)
              .with('commitSent', 'registrationSent', () => true)
              .otherwise(() => false)}
            color={match(transactionState)
              .with(
                'commitReady',
                'commitSent',
                'commitComplete',
                'commitFailed',
                () => 'border' as const,
              )
              .otherwise(() => 'blueLight' as const)}
          />
        </CountDownInner>
      </CountdownContainer>
      <CenteredTypography data-testid="transactions-subheading">
        {match(transactionState)
          .with('registrationComplete', () => '')
          .with('registrationOverriden', () => (
            <Trans i18nKey="steps.transactions.subheading.commitCompleteNoDuration" t={t} />
          ))
          .with('registrationReady', 'registrationSent', 'registrationFailed', () =>
            match(duration)
              .with(P.not(P.nullish), () => (
                <Trans
                  i18nKey="steps.transactions.subheading.commitComplete"
                  t={t}
                  values={{ duration }}
                />
              ))
              .with(null, () => t('steps.transactions.subheading.commitExpired'))
              .otherwise(() => (
                <Trans i18nKey="steps.transactions.subheading.commitCompleteNoDuration" t={t} />
              )),
          )
          .with('commitComplete', () => (
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
          .with('commitSent', () => (
            <Trans i18nKey="steps.transactions.subheading.commitSent" t={t} />
          ))
          .with('commitReady', 'commitFailed', () => t('steps.transactions.subheading.default'))
          .exhaustive()}
      </CenteredTypography>
      <ButtonContainer>
        {match(transactionState)
          .with('registrationComplete', () => null)
          .with('registrationFailed', () => (
            <>
              {ResetBackButton}
              <FailedButton
                label={t('steps.transactions.transactionFailed')}
                onClick={showRegisterTransaction}
              />
            </>
          ))
          .with('registrationSent', () => (
            <ProgressButton
              label={t('steps.transactions.transactionProgress')}
              onClick={showRegisterTransaction}
            />
          ))
          .with(
            'registrationReady',
            () => duration === null,
            () => (
              <div>
                <Button colorStyle="redSecondary" onClick={() => setResetOpen(true)}>
                  {t('action.restart', { ns: 'common' })}
                </Button>
              </div>
            ),
          )
          .with('registrationReady', 'registrationOverriden', () => (
            <>
              {ResetBackButton}
              <MobileFullWidth>
                <Button
                  data-testid="finish-button"
                  onClick={!registerTx ? makeRegisterNameFlow : showRegisterTransaction}
                >
                  {t('steps.transactions.completeRegistration')}
                </Button>
              </MobileFullWidth>
            </>
          ))
          .with('commitFailed', () => (
            <>
              {NormalBackButton}
              <FailedButton
                label={t('steps.transactions.transactionFailed')}
                onClick={showCommitTransaction}
              />
            </>
          ))
          .with('commitComplete', () => (
            <>
              {ResetBackButton}
              <MobileFullWidth>
                <Button
                  data-testid="wait-button"
                  disabled
                  suffix={() => <Spinner color="greyPrimary" />}
                >
                  {t('steps.transactions.wait')}
                </Button>
              </MobileFullWidth>
            </>
          ))
          .with('commitSent', () => (
            <ProgressButton
              label={t('steps.transactions.transactionProgress')}
              onClick={showCommitTransaction}
            />
          ))
          .with('commitReady', () => (
            <>
              <MobileFullWidth>
                <Button onClick={() => callback({ back: true })} colorStyle="accentSecondary">
                  {t('action.back', { ns: 'common' })}
                </Button>
              </MobileFullWidth>
              <MobileFullWidth>
                <Button data-testid="start-timer-button" onClick={makeCommitNameFlow}>
                  {t('steps.transactions.startTimer')}
                </Button>
              </MobileFullWidth>
            </>
          ))
          .exhaustive()}
      </ButtonContainer>
    </StyledCard>
  )
}

export default Transactions
