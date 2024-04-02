import { queryOptions, useQuery } from '@tanstack/react-query'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { BaseError } from 'viem'
import { useClient, useConnectorClient, useSendTransaction } from 'wagmi'

import {
  Button,
  CrossCircleSVG,
  Dialog,
  Helper,
  QuestionCircleSVG,
  Spinner,
  Typography,
} from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import CircleTickSVG from '@app/assets/CircleTick.svg'
import WalletSVG from '@app/assets/Wallet.svg'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useInvalidateOnBlock } from '@app/hooks/chain/useInvalidateOnBlock'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import {
  ManagedDialogProps,
  TransactionFlowAction,
  TransactionStage,
} from '@app/transaction-flow/types'
import { ConfigWithEns } from '@app/types'
import { getReadableError } from '@app/utils/errors'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { makeEtherscanLink } from '@app/utils/utils'

import { DisplayItems } from '../DisplayItems'
import {
  createTransactionRequestQueryFn,
  getTransactionErrorQueryFn,
  getUniqueTransaction,
  transactionSuccessHandler,
} from './query'

const BarContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const WalletIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
  `,
)

const Bar = styled.div<{ $status: Status }>(
  ({ theme, $status }) => css`
    width: ${theme.space.full};
    height: ${theme.space['9']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.blueSurface};
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    --bar-color: ${theme.colors.blue};

    ${$status === 'complete' &&
    css`
      --bar-color: ${theme.colors.green};
    `}
    ${$status === 'failed' &&
    css`
      --bar-color: ${theme.colors.red};
    `}
  `,
)

const BarTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const ProgressTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: ${theme.fontWeights.bold};
    text-align: center;
  `,
)

const AeroplaneIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    color: ${theme.colors.background};
  `,
)

const CircleIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    color: ${theme.colors.background};
  `,
)

const MessageTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

type Status = Omit<TransactionStage, 'confirm'>

const BarPrefix = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    width: min-content;
    white-space: nowrap;
    height: ${theme.space['9']};
    margin-right: -1px;

    border-radius: ${theme.radii.full};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--bar-color);
  `,
)

const InnerBar = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    height: ${theme.space['9']};

    border-radius: ${theme.radii.full};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    transition: width 1s linear;
    &.progress-complete {
      width: 100% !important;
      padding-right: ${theme.space['2']};
      transition: width 0.5s ease-in-out;
    }

    background-color: var(--bar-color);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    position: relative;

    & > svg {
      position: absolute;
      right: ${theme.space['2']};
      top: 50%;
      transform: translateY(-50%);
    }
  `,
)

export const LoadBar = ({ status, sendTime }: { status: Status; sendTime: number | undefined }) => {
  const { t } = useTranslation()

  const time = useMemo(() => ({ start: sendTime || Date.now(), ms: 45000 }), [sendTime])
  const [{ progress }, setProgress] = useState({ progress: 0, timeLeft: 45 })

  const intervalFunc = useCallback(
    (interval?: NodeJS.Timeout) => {
      const timeElapsed = Date.now() - time.start
      const _timeLeft = time.ms - timeElapsed
      const _progress = Math.min((timeElapsed / (timeElapsed + _timeLeft)) * 100, 100)
      setProgress({ timeLeft: Math.floor(_timeLeft / 1000), progress: _progress })
      if (_progress === 100) clearInterval(interval)
    },
    [time.ms, time.start],
  )

  useEffect(() => {
    intervalFunc()
    const interval = setInterval(intervalFunc, 1000)
    return () => clearInterval(interval)
  }, [intervalFunc])

  const message = useMemo(() => {
    if (status === 'complete') {
      return t('transaction.dialog.complete.message')
    }
    if (status === 'failed') {
      return null
    }
    return t('transaction.dialog.sent.message')
  }, [status, t])

  const isTakingLongerThanExpected = status === 'sent' && progress === 100

  const progressMessage = useMemo(() => {
    if (isTakingLongerThanExpected) {
      return (
        <Outlink
          iconPosition="before"
          icon={QuestionCircleSVG}
          href="https://support.ens.domains/en/articles/7982906-long-running-transactions"
        >
          {t('transaction.dialog.sent.learn')}
        </Outlink>
      )
    }
    return null
  }, [isTakingLongerThanExpected, t])

  const EndElement = useMemo(() => {
    if (status === 'complete') {
      return <CircleIcon as={CircleTickSVG} />
    }
    if (status === 'failed') {
      return <CircleIcon as={CrossCircleSVG} />
    }
    if (progress !== 100) {
      return <AeroplaneIcon as={AeroplaneSVG} />
    }
    return <Spinner color="background" size="small" />
  }, [progress, status])

  return (
    <>
      <BarContainer data-testid="load-bar-container">
        <Bar $status={status} key={sendTime}>
          <BarPrefix>
            <BarTypography>
              {t(
                isTakingLongerThanExpected
                  ? 'transaction.dialog.sent.progress.message'
                  : `transaction.dialog.${status}.progress.title`,
              )}
            </BarTypography>
          </BarPrefix>
          <InnerBar
            style={{ width: `${progress}%` }}
            className={progress === 100 || status !== 'sent' ? 'progress-complete' : ''}
          >
            {EndElement}
          </InnerBar>
        </Bar>
        {progressMessage && <ProgressTypography>{progressMessage}</ProgressTypography>}
      </BarContainer>
      {message && <MessageTypography>{message}</MessageTypography>}
    </>
  )
}

export const handleBackToInput = (dispatch: Dispatch<TransactionFlowAction>) => () => {
  dispatch({ name: 'setFlowStage', payload: 'input' })
  dispatch({ name: 'resetTransactionStep' })
}

export const TransactionStageModal = ({
  actionName,
  currentStep,
  displayItems,
  helper,
  dispatch,
  stepCount,
  transaction,
  txKey,
  onDismiss,
  backToInput,
}: ManagedDialogProps) => {
  const { t } = useTranslation()
  const chainName = useChainName()

  const { data: isSafeApp, isLoading: safeAppStatusLoading } = useIsSafeApp()
  const { data: connectorClient } = useConnectorClient<ConfigWithEns>()
  const client = useClient()

  const addRecentTransaction = useAddRecentTransaction()

  const stage = transaction.stage || 'confirm'
  const recentTransactions = useRecentTransactions()
  const transactionStatus = useMemo(
    () => recentTransactions.find((tx) => tx.hash === transaction.hash)?.status,
    [recentTransactions, transaction.hash],
  )

  const uniqueTxIdentifiers = useMemo(
    () =>
      getUniqueTransaction({
        txKey,
        currentStep,
        transaction,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txKey, currentStep, transaction?.name, transaction?.data],
  )

  // if not all unique identifiers are defined, there could be incorrect cached data
  const isUniquenessDefined = useMemo(
    // number check is for if step = 0
    () => Object.values(uniqueTxIdentifiers).every((val) => typeof val === 'number' || !!val),
    [uniqueTxIdentifiers],
  )

  const canEnableTransactionRequest = useMemo(
    () =>
      !!transaction &&
      !!connectorClient?.account &&
      !safeAppStatusLoading &&
      !(stage === 'sent' || stage === 'complete') &&
      isUniquenessDefined,
    [transaction, connectorClient?.account, safeAppStatusLoading, stage, isUniquenessDefined],
  )

  const initialOptions = useQueryOptions({
    params: uniqueTxIdentifiers,
    functionName: 'createTransactionRequest',
    queryDependencyType: 'standard',
    queryFn: createTransactionRequestQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn({ connectorClient, isSafeApp }),
  })

  const transactionRequestQuery = useQuery({
    ...preparedOptions,
    enabled: canEnableTransactionRequest,
    refetchOnMount: 'always',
  })

  const { data: request, isLoading: requestLoading, error: requestError } = transactionRequestQuery
  const isTransactionRequestCachedData = getIsCachedData(transactionRequestQuery)

  useInvalidateOnBlock({
    enabled: canEnableTransactionRequest && process.env.NEXT_PUBLIC_ETH_NODE !== 'anvil',
    queryKey: preparedOptions.queryKey,
  })

  const {
    isPending: transactionLoading,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction({
    mutation: {
      onSuccess: transactionSuccessHandler({
        client,
        connectorClient: connectorClient!,
        actionName,
        txKey,
        request,
        addRecentTransaction,
        dispatch,
        isSafeApp,
      }),
    },
  })

  const FilledDisplayItems = useMemo(
    () => <DisplayItems displayItems={[...(displayItems || [])]} />,
    [displayItems],
  )

  const MiddleContent = useMemo(() => {
    if (stage !== 'confirm') {
      return <LoadBar status={stage} sendTime={transaction.sendTime} />
    }
    return (
      <>
        <WalletIcon as={WalletSVG} />
        <MessageTypography>{t('transaction.dialog.confirm.message')}</MessageTypography>
      </>
    )
  }, [stage, t, transaction.sendTime])

  const HelperContent = useMemo(() => {
    if (!helper) return null
    return <Helper {...helper} />
  }, [helper])

  const ActionButton = useMemo(() => {
    if (stage === 'complete') {
      const final = currentStep + 1 === stepCount

      if (final) {
        return (
          <Button
            data-testid="transaction-modal-complete-button"
            onClick={() => onDismiss()}
            colorStyle="accentSecondary"
          >
            {t('action.done')}
          </Button>
        )
      }
      return (
        <Button
          data-testid="transaction-modal-complete-button"
          onClick={() => dispatch({ name: 'incrementTransaction' })}
        >
          {t('action.next')}
        </Button>
      )
    }
    if (stage === 'failed') {
      return (
        <Button
          onClick={() => sendTransaction(request!)}
          disabled={!canEnableTransactionRequest || requestLoading || !request}
          colorStyle="redSecondary"
          data-testid="transaction-modal-failed-button"
        >
          {t('action.tryAgain')}
        </Button>
      )
    }
    if (stage === 'sent') {
      return (
        <Button
          onClick={() => onDismiss()}
          data-testid="transaction-modal-sent-button"
          colorStyle="accentSecondary"
        >
          {t('action.close')}
        </Button>
      )
    }
    if (transactionLoading) {
      return (
        <Button
          disabled
          suffix={<Spinner color="background" />}
          data-testid="transaction-modal-confirm-button"
        >
          {t('transaction.dialog.confirm.waitingForWallet')}
        </Button>
      )
    }
    return (
      <Button
        disabled={
          !canEnableTransactionRequest ||
          requestLoading ||
          !request ||
          !!requestError ||
          isTransactionRequestCachedData
        }
        onClick={() => sendTransaction(request!)}
        data-testid="transaction-modal-confirm-button"
      >
        {t('transaction.dialog.confirm.openWallet')}
      </Button>
    )
  }, [
    canEnableTransactionRequest,
    currentStep,
    dispatch,
    onDismiss,
    requestError,
    requestLoading,
    sendTransaction,
    stage,
    stepCount,
    t,
    transactionLoading,
    request,
    isTransactionRequestCachedData,
  ])

  const stepStatus = useMemo(() => {
    if (stage === 'complete') {
      return 'completed'
    }
    return 'inProgress'
  }, [stage])

  const initialErrorOptions = useQueryOptions({
    params: { hash: transaction.hash, status: transactionStatus },
    functionName: 'getTransactionError',
    queryDependencyType: 'standard',
    queryFn: getTransactionErrorQueryFn,
  })

  const preparedErrorOptions = queryOptions({
    queryKey: initialErrorOptions.queryKey,
    queryFn: initialErrorOptions.queryFn,
  })

  const { data: upperError } = useQuery({
    ...preparedErrorOptions,
    enabled: !!transaction && !!transaction.hash && transactionStatus === 'failed',
  })

  const lowerError = useMemo(() => {
    if (stage === 'complete' || stage === 'sent') return null
    const err = transactionError || requestError
    if (!err) return null
    if (!(err instanceof BaseError)) {
      if ('message' in err) return err.message
      return t('transaction.error.unknown')
    }
    const readableError = getReadableError(err)
    return readableError || err.shortMessage
  }, [t, stage, transactionError, requestError])

  return (
    <>
      <Dialog.Heading title={t(`transaction.dialog.${stage}.title`)} />
      <InnerDialog data-testid="transaction-modal-inner">
        {MiddleContent}
        {upperError && <Helper type="error">{t(upperError)}</Helper>}
        {FilledDisplayItems}
        {HelperContent}
        {transaction.hash && (
          <Outlink href={makeEtherscanLink(transaction.hash!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        )}
        {lowerError && <Helper type="error">{lowerError}</Helper>}
      </InnerDialog>
      <Dialog.Footer
        currentStep={currentStep}
        stepCount={stepCount > 1 ? stepCount : undefined}
        stepStatus={stepStatus}
        trailing={ActionButton}
        leading={
          backToInput &&
          !(stage === 'sent' || stage === 'complete') && (
            <Button colorStyle="accentSecondary" onClick={handleBackToInput(dispatch)}>
              {t('action.back')}
            </Button>
          )
        }
      />
    </>
  )
}
