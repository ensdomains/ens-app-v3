import { BigNumber } from '@ethersproject/bignumber'
import { hexValue } from '@ethersproject/bytes'
import type { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { toUtf8String } from '@ethersproject/strings'
import { Provider } from '@wagmi/core'
import type { PopulatedTransaction } from 'ethers'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useProvider, useQuery, useSendTransaction, useSigner } from 'wagmi'

import { Button, CrossCircleSVG, Dialog, Helper, Spinner, Typography } from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import CircleTickSVG from '@app/assets/CircleTick.svg'
import WalletSVG from '@app/assets/Wallet.svg'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink } from '@app/components/Outlink'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainName } from '@app/hooks/useChainName'
import { useInvalidateOnBlock } from '@app/hooks/useInvalidateOnBlock'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { transactions } from '@app/transaction-flow/transaction'
import {
  ManagedDialogPropsTwo,
  TransactionFlowAction,
  TransactionStage,
} from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
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

type TxError = {
  reason: string
  code: string
  method: string
  transaction: object
  error: Error
}

type AccessListResponse = {
  accessList: {
    address: string
    storageKeys: string[]
  }[]
  gasUsed: string
}

const SUPPORTED_REQUEST_ERRORS = ['INSUFFICIENT_FUNDS', 'UNPREDICTABLE_GAS_LIMIT']

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
            <BarTypography>{t(`transaction.dialog.${status}.progress.title`)}</BarTypography>
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

export const uniqueTransactionIdentifierGenerator = (
  txKey: ManagedDialogPropsTwo['txKey'],
  currentStep: number,
  transactionName: ManagedDialogPropsTwo['transaction']['name'],
  transactionData: ManagedDialogPropsTwo['transaction']['data'],
) => ({
  key: txKey,
  step: currentStep,
  name: transactionName,
  data: transactionData,
})

export const transactionSuccessHandler =
  (dependencies: {
    provider: Provider
    actionName: ManagedDialogPropsTwo['actionName']
    txKey: string | null
    request: PopulatedTransaction | undefined
    addRecentTransaction: ReturnType<typeof useAddRecentTransaction>
    dispatch: Dispatch<TransactionFlowAction>
    isSafeApp: ReturnType<typeof useIsSafeApp>['data']
  }) =>
  async (tx: any) => {
    const { provider, actionName, txKey, request, addRecentTransaction, dispatch, isSafeApp } =
      dependencies
    let transactionData = null
    try {
      // If using private mempool, this won't error, will return null
      transactionData = await provider.getTransaction(tx.hash)
    } catch (e) {
      console.error('Failed to get transaction info')
    }

    addRecentTransaction({
      ...transactionData,
      hash: tx.hash,
      action: actionName,
      key: txKey!,
      input: request?.data,
      timestamp: Math.floor(Date.now() / 1000),
      isSafeTx: !!isSafeApp,
      searchRetries: 0,
    })
    dispatch({ name: 'setTransactionHash', payload: tx.hash })
  }

export const registrationGasFeeModifier = (gasLimit: BigNumber, transactionName: string) =>
  // this addition is arbitrary, something to do with a gas refund but not 100% sure
  transactionName === 'registerName' ? gasLimit.add(5000) : gasLimit

export const calculateGasLimit = async ({
  isSafeApp,
  provider,
  txWithZeroGas,
  transactionName,
  signer,
}: {
  isSafeApp: string | boolean | undefined
  provider: FallbackProvider
  txWithZeroGas: {
    maxFeePerGas: string
    maxPriorityFeePerGas: string
    value?: BigNumber
  }
  transactionName: string
  signer: ReturnType<typeof useSigner>['data']
}) => {
  if (isSafeApp) {
    const accessListResponse: AccessListResponse = await (
      provider.providerConfigs[0].provider as JsonRpcProvider
    ).send('eth_createAccessList', [
      {
        ...txWithZeroGas,
        value: txWithZeroGas.value ? hexValue(txWithZeroGas.value.add(1000000)) : '0x0',
      },
      'latest',
    ])

    return {
      gasLimit: registrationGasFeeModifier(
        BigNumber.from(accessListResponse.gasUsed),
        transactionName,
      ),
      accessList: accessListResponse.accessList,
    }
  }

  if (!signer) {
    throw new Error('Signer not found')
  }

  const gasEstimate = await signer.estimateGas(txWithZeroGas)
  return {
    gasLimit: registrationGasFeeModifier(gasEstimate, transactionName),
    accessList: undefined,
  }
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

  const { data: isSafeApp, isLoading: safeAppStatusLoading } = useIsSafeApp()
  const provider = useProvider<FallbackProvider>()

  const uniqueTxIdentifiers = useMemo(
    () =>
      uniqueTransactionIdentifierGenerator(
        txKey,
        currentStep,
        transaction?.name,
        transaction?.data,
      ),
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
      !!signer &&
      !safeAppStatusLoading &&
      !!ens &&
      !(stage === 'sent' || stage === 'complete') &&
      isUniquenessDefined,
    [transaction, signer, safeAppStatusLoading, ens, stage, isUniquenessDefined],
  )

  const queryKeys = useQueryKeys()

  const {
    data: request,
    isLoading: requestLoading,
    error: _requestError,
  } = useQuery(
    queryKeys.transactionStageModal.prepareTransaction(uniqueTxIdentifiers),
    async () => {
      const populatedTransaction = await transactions[transaction.name].transaction(
        signer as JsonRpcSigner,
        ens,
        transaction.data,
      )

      const txWithZeroGas = {
        ...populatedTransaction,
        maxFeePerGas: '0x0',
        maxPriorityFeePerGas: '0x0',
      }

      const { gasLimit, accessList } = await calculateGasLimit({
        isSafeApp,
        provider,
        txWithZeroGas,
        signer,
        transactionName: transaction.name,
      })

      return {
        ...populatedTransaction,
        to: populatedTransaction.to as `0x${string}`,
        gasLimit,
        accessList,
      }
    },
    {
      enabled: canEnableTransactionRequest,
      onError: console.error,
    },
  )
  const requestError = _requestError as TxError | null
  useInvalidateOnBlock({
    enabled: canEnableTransactionRequest,
    queryKey: queryKeys.transactionStageModal.prepareTransaction(uniqueTxIdentifiers),
  })

  const {
    isLoading: transactionLoading,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction({
    mode: 'prepared',
    request,
    onSuccess: transactionSuccessHandler({
      provider,
      actionName,
      txKey,
      request,
      addRecentTransaction,
      dispatch,
      isSafeApp,
    }),
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
          onClick={() => sendTransaction!()}
          disabled={!canEnableTransactionRequest || requestLoading || !sendTransaction}
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
          !canEnableTransactionRequest || requestLoading || !sendTransaction || !!requestError
        }
        onClick={() => sendTransaction!()}
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
  ])

  const stepStatus = useMemo(() => {
    if (stage === 'complete') {
      return 'completed'
    }
    return 'inProgress'
  }, [stage])

  const { data: upperError } = useQuery(
    useQueryKeys().transactionStageModal.transactionError(transaction.hash),
    async () => {
      if (!transaction || !transaction.hash || transactionStatus !== 'failed') return null
      const a = await provider.getTransaction(transaction.hash!)
      try {
        await provider.call(a as any, a.blockNumber)
        return 'transaction.dialog.error.gasLimit'
      } catch (err: any) {
        const code = err.data.replace('Reverted ', '')
        const reason = toUtf8String(`0x${code.substr(138)}`)
        return reason
      }
    },
    {
      enabled: !!transaction && !!transaction.hash && transactionStatus === 'failed',
    },
  )

  const lowerError = useMemo(() => {
    if (stage === 'complete' || stage === 'sent') return null
    if (transactionError) {
      return transactionError.message.split('(')[0].trim()
    }
    if (requestError) {
      if (SUPPORTED_REQUEST_ERRORS.includes(requestError.code)) {
        return t(`transaction.error.request.${requestError.code}`)
      }
      return requestError.reason
    }
    return null
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
