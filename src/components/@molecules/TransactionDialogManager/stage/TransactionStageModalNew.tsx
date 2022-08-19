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
import { Button, Dialog, Helper, Spinner, Typography } from '@ensdomains/thorin'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { useAddRecentTransaction, useRecentTransactions } from '@rainbow-me/rainbowkit'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery, useSendTransaction, useSigner } from 'wagmi'
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

type Status = Omit<TransactionStage, 'confirm'>

const InnerBar = styled.div<{ $progress: number; $status: Status }>(
  ({ theme, $progress, $status }) => css`
    transition: 1s width linear;
    width: ${$progress * 0.8 + 20}%;
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

const LoadBar = ({ status }: { status: Status }) => {
  const startTime = useMemo(() => Date.now(), [])
  const response = useMemo(() => ({ recieved: Date.now(), ms: 60000 }), [])
  const [{ progress, timeLeft }, setProgress] = useState({ progress: 0, timeLeft: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Date.now() - startTime
      const timeElapsedSinceResponse = Date.now() - response.recieved
      const _timeLeft = response.ms - timeElapsedSinceResponse
      const _progress = Math.min((timeElapsed / (timeElapsed + _timeLeft)) * 100, 100)
      setProgress({ timeLeft: Math.floor(_timeLeft / 1000), progress: _progress })
      if (_progress === 100) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [response.ms, response.recieved, startTime])

  const message = useMemo(() => {
    if (status === 'complete') {
      return 'Your transaction is now complete!'
    }
    if (status === 'failed') {
      return null
    }
    return 'Your transaction is now in progress, you can close this and come back later.'
  }, [status])
  const progressMessage = useMemo(() => {
    if (status === 'sent') {
      if (timeLeft > 0) {
        return `${timeLeft} seconds remaining`
      }
      return 'Taking longer than expected'
    }
    return null
  }, [timeLeft, status])

  const StartElement = useMemo(() => {
    if (status === 'complete') {
      return 'Done'
    }
    if (status === 'failed') {
      return 'Failed'
    }
    return 'Sent'
  }, [status])

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
      <BarContainer>
        <Bar>
          <InnerBar $progress={status !== 'sent' ? 100 : progress} $status={status}>
            <BarTypography>{StartElement}</BarTypography>
            {EndElement}
          </InnerBar>
        </Bar>
        {progressMessage && <ProgressTypography>{progressMessage}</ProgressTypography>}
      </BarContainer>
      {message && <Typography>{message}</Typography>}
    </>
  )
}

export const TransactionStageModalNew = ({
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
      return <LoadBar status={stage} />
    }
    return (
      <>
        <WalletIcon as={WalletSVG} />
        <Typography>Double check these details before confirming in your wallet.</Typography>
      </>
    )
  }, [stage])

  const ActionButton = useMemo(() => {
    if (stage === 'complete') {
      const final = currentStep + 1 === stepCount

      if (final) {
        return (
          <Button onClick={() => onDismiss()} shadowless variant="secondary">
            Done
          </Button>
        )
      }
      return (
        <Button onClick={() => dispatch({ name: 'incrementTransaction' })} shadowless>
          Next
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
        >
          Try Again
        </Button>
      )
    }
    if (stage === 'sent') {
      return (
        <Button shadowless onClick={() => onDismiss()} variant="secondary">
          Close
        </Button>
      )
    }
    if (transactionLoading) {
      return (
        <Button shadowless disabled>
          Waiting for Wallet
        </Button>
      )
    }
    return (
      <Button
        shadowless
        disabled={requestLoading || !sendTransaction}
        onClick={() => sendTransaction!()}
      >
        Open Wallet
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
    transactionLoading,
  ])

  const stepStatus = useMemo(() => {
    if (stage === 'complete') {
      return 'completed'
    }
    return 'inProgress'
  }, [stage])

  const title = useMemo(() => {
    if (stage === 'complete') {
      return 'Transaction Complete'
    }
    if (stage === 'failed') {
      return 'Transaction Failed'
    }
    if (stage === 'sent') {
      return 'Transaction Sent'
    }
    return 'Confirm Details'
  }, [stage])

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
        title={title}
        currentStep={currentStep}
        stepCount={stepCount > 1 ? stepCount : undefined}
        stepStatus={stepStatus}
      />
      <InnerDialog data-testid="transaction-modal-inner">
        {MiddleContent}
        {FilledDisplayItems}
        {transaction.hash && (
          <Outlink href={makeEtherscanLink(transaction.hash!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        )}
        {lowerError && <Helper type="error">{lowerError}</Helper>}
      </InnerDialog>
      <Dialog.Footer trailing={ActionButton} />
    </>
  )
}
