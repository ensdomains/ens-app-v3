import type { JsonRpcSigner } from '@ethersproject/providers'
import { useAddRecentTransaction, useRecentTransactions } from '@rainbow-me/rainbowkit'
import { utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useProvider, useQuery, useSendTransaction, useSigner } from 'wagmi'

import { Button, Dialog, Helper, Spinner, Typography } from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import CircleCrossSVG from '@app/assets/CircleCross.svg'
import CircleTickSVG from '@app/assets/CircleTick.svg'
import WalletSVG from '@app/assets/Wallet.svg'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/useChainName'
import { useInvalidateOnBlock } from '@app/hooks/useInvalidateOnBlock'
import { transactions } from '@app/transaction-flow/transaction'
import { ManagedDialogPropsTwo, TransactionStage } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { makeEtherscanLink } from '@app/utils/utils'

import { DisplayItems } from '../DisplayItems'

const BarContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['1']};
  `,
)

const WalletIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
  `,
)

const Bar = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space['9']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.lightBlue};
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
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

const InnerBar = styled.div<{ $progress: number; $status: Status }>(
  ({ theme, $progress, $status }) => css`
    transition: 1s width linear;
    width: calc(
      calc(${$progress / 100} * calc(100% - ${theme.space['24']})) + ${theme.space['24']}
    );
    height: ${theme.space['9']};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['2']} ${theme.space['4']};

    ${$progress === 100 &&
    css`
      padding-right: ${theme.space['2']};
      transition: 0.5s width ease-in-out;
    `}

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background-color: ${theme.colors.blue};
    ${$status === 'complete' &&
    css`
      background-color: ${theme.colors.green};
    `}
    ${$status === 'failed' &&
    css`
      background-color: ${theme.colors.red};
    `}
  `,
)

const LoadBar = ({ status, sendTime }: { status: Status; sendTime: number | undefined }) => {
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

  const progressMessage = useMemo(() => {
    if (status === 'sent' && progress === 100) {
      return t('transaction.dialog.sent.progress.message')
    }
    return null
  }, [status, progress, t])

  const EndElement = useMemo(() => {
    if (status === 'complete') {
      return <CircleIcon as={CircleTickSVG} />
    }
    if (status === 'failed') {
      return <CircleIcon as={CircleCrossSVG} />
    }
    if (progress !== 100) {
      return <AeroplaneIcon as={AeroplaneSVG} />
    }
    return <Spinner color="background" size="small" />
  }, [progress, status])

  return (
    <>
      <BarContainer data-testid="load-bar-container">
        <Bar>
          <InnerBar $progress={status !== 'sent' ? 100 : progress} $status={status}>
            <BarTypography>{t(`transaction.dialog.${status}.progress.title`)}</BarTypography>
            {EndElement}
          </InnerBar>
        </Bar>
        {progressMessage && <ProgressTypography>{progressMessage}</ProgressTypography>}
      </BarContainer>
      {message && <MessageTypography>{message}</MessageTypography>}
    </>
  )
}

export const TransactionStageModal = ({
  actionName,
  currentStep,
  displayItems,
  dispatch,
  stepCount,
  transaction,
  txKey,
  onDismiss,
}: ManagedDialogPropsTwo) => {
  const { t } = useTranslation()
  const chainName = useChainName()

  const addRecentTransaction = useAddRecentTransaction()
  const { data: signer } = useSigner()
  const ens = useEns()

  const stage = transaction.stage || 'confirm'
  const recentTransactions = useRecentTransactions()
  const transactionStatus = useMemo(
    () => recentTransactions.find((tx) => tx.hash === transaction.hash)?.status,
    [recentTransactions, transaction.hash],
  )

  useEffect(() => {
    if (transactionStatus === 'confirmed') {
      dispatch({ name: 'setTransactionStage', payload: 'complete' })
    }
    if (transactionStatus === 'failed') {
      dispatch({ name: 'setTransactionStage', payload: 'failed' })
    }
  }, [dispatch, transactionStatus])

  const {
    data: request,
    isLoading: requestLoading,
    error: _requestError,
  } = useQuery(
    ['prepareTx', txKey, currentStep],
    async () => {
      const populatedTransaction = await transactions[transaction.name].transaction(
        signer as JsonRpcSigner,
        ens,
        transaction.data,
      )
      const gasLimit = await signer!.estimateGas(populatedTransaction)

      return {
        ...populatedTransaction,
        to: populatedTransaction.to as `0x${string}`,
        gasLimit,
      }
    },
    {
      enabled: !!transaction && !!signer && !!ens,
    },
  )
  const requestError = _requestError as Error | null
  useInvalidateOnBlock({
    enabled: !!transaction && !!signer && !!ens,
    queryKey: ['prepareTx', txKey, currentStep],
  })

  const {
    isLoading: transactionLoading,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction({
    mode: 'prepared',
    request,
    onSuccess: (tx) => {
      addRecentTransaction({
        hash: tx.hash,
        description: JSON.stringify({ action: actionName, key: txKey }),
      })
      dispatch({ name: 'setTransactionHash', payload: tx.hash })
    },
  })

  const FilledDisplayItems = useMemo(
    () => (
      <DisplayItems
        displayItems={[
          {
            label: 'action',
            value: t(`transaction.description.${actionName}`),
          },
          {
            label: 'info',
            value: t(`transaction.info.${actionName}`),
          },
          ...(displayItems || []),
        ]}
      />
    ),
    [actionName, displayItems, t],
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

  const ActionButton = useMemo(() => {
    if (stage === 'complete') {
      const final = currentStep + 1 === stepCount

      if (final) {
        return (
          <Button
            data-testid="transaction-modal-complete-button"
            onClick={() => onDismiss()}
            shadowless
            variant="secondary"
          >
            {t('action.done')}
          </Button>
        )
      }
      return (
        <Button
          data-testid="transaction-modal-complete-button"
          onClick={() => dispatch({ name: 'incrementTransaction' })}
          shadowless
        >
          {t('action.next')}
        </Button>
      )
    }
    if (stage === 'failed') {
      return (
        <Button
          shadowless
          onClick={() => sendTransaction!()}
          disabled={requestLoading || !sendTransaction}
          tone="red"
          variant="secondary"
          data-testid="transaction-modal-failed-button"
        >
          {t('action.tryAgain')}
        </Button>
      )
    }
    if (stage === 'sent') {
      return (
        <Button
          shadowless
          onClick={() => onDismiss()}
          data-testid="transaction-modal-sent-button"
          variant="secondary"
        >
          {t('action.close')}
        </Button>
      )
    }
    if (transactionLoading) {
      return (
        <Button
          shadowless
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
        shadowless
        disabled={requestLoading || !sendTransaction}
        onClick={() => sendTransaction!()}
        data-testid="transaction-modal-confirm-button"
      >
        {t('transaction.dialog.confirm.openWallet')}
      </Button>
    )
  }, [
    currentStep,
    dispatch,
    onDismiss,
    requestLoading,
    sendTransaction,
    stage,
    stepCount,
    t,
    transactionLoading,
  ])

  const stepStatus = useMemo(() => {
    if (stage === 'complete') {
      return 'completed'
    }
    return 'inProgress'
  }, [stage])

  const provider = useProvider()

  const { data: upperError } = useQuery(
    ['txError', transaction.hash],
    async () => {
      if (!transaction || !transaction.hash || transactionStatus !== 'failed') return null
      const a = await provider.getTransaction(transaction.hash!)
      try {
        await provider.call(a as any, a.blockNumber)
        return 'transaction.dialog.error.gasLimit'
      } catch (err: any) {
        const code = err.data.replace('Reverted ', '')
        const reason = utils.toUtf8String(`0x${code.substr(138)}`)
        return reason
      }
    },
    {
      enabled: !!transaction && !!transaction.hash && transactionStatus === 'failed',
    },
  )

  const lowerError = useMemo(() => {
    if (transactionError) {
      return transactionError.message
    }
    if (requestError) {
      return requestError.message
    }
    return null
  }, [transactionError, requestError])

  return (
    <>
      <Dialog.Heading
        title={t(`transaction.dialog.${stage}.title`)}
        currentStep={currentStep}
        stepCount={stepCount > 1 ? stepCount : undefined}
        stepStatus={stepStatus}
      />
      <InnerDialog data-testid="transaction-modal-inner">
        {MiddleContent}
        {upperError && <Helper type="error">{t(upperError)}</Helper>}
        {FilledDisplayItems}
        {transaction.hash && (
          <Outlink href={makeEtherscanLink(transaction.hash!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        )}
        {lowerError && <Helper type="error">{lowerError}</Helper>}
      </InnerDialog>
      <Dialog.Footer center trailing={ActionButton} />
    </>
  )
}
