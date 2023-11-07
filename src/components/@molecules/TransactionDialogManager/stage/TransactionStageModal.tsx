import { PrepareSendTransactionResult, SendTransactionResult } from '@wagmi/core'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import {
  Address,
  BaseError,
  BlockTag,
  Hash,
  Hex,
  toHex,
  Transaction,
  TransactionRequest,
  WalletClient,
} from 'viem'
import { useQuery, useSendTransaction } from 'wagmi'

import { Button, CrossCircleSVG, Dialog, Helper, Spinner, Typography } from '@ensdomains/thorin2'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import CircleTickSVG from '@app/assets/CircleTick.svg'
import WalletSVG from '@app/assets/Wallet.svg'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink } from '@app/components/Outlink'
import { useWalletClientWithAccount } from '@app/hooks/account/useWalletClient'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useInvalidateOnBlock } from '@app/hooks/chain/useInvalidateOnBlock'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { usePublicClient } from '@app/hooks/usePublicClient'
import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { createTransactionRequest, TransactionName } from '@app/transaction-flow/transaction'
import {
  GetUniqueTransactionParameters,
  ManagedDialogProps,
  TransactionFlowAction,
  TransactionStage,
  UniqueTransaction,
} from '@app/transaction-flow/types'
import { BasicTransactionRequest, PublicClientWithChain } from '@app/types'
import { getReadableError } from '@app/utils/errors'
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

type AccessListResponse = {
  accessList: {
    address: Address
    storageKeys: Hex[]
  }[]
  gasUsed: Hex
}

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

export const getUniqueTransaction = ({
  txKey,
  currentStep,
  transaction,
}: GetUniqueTransactionParameters): UniqueTransaction => ({
  key: txKey!,
  step: currentStep,
  name: transaction.name,
  data: transaction.data,
})

export const transactionSuccessHandler =
  ({
    publicClient,
    walletClient,
    actionName,
    txKey,
    request,
    addRecentTransaction,
    dispatch,
    isSafeApp,
  }: {
    publicClient: PublicClientWithChain
    walletClient: WalletClient
    actionName: ManagedDialogProps['actionName']
    txKey: string | null
    request: BasicTransactionRequest | undefined
    addRecentTransaction: ReturnType<typeof useAddRecentTransaction>
    dispatch: Dispatch<TransactionFlowAction>
    isSafeApp: ReturnType<typeof useIsSafeApp>['data']
  }) =>
  async (tx: SendTransactionResult) => {
    let transactionData: Transaction | null = null
    try {
      // If using private mempool, this won't error, will return null
      transactionData = await walletClient.request<{
        Method: 'eth_getTransactionByHash'
        Parameters: [hash: Hash]
        ReturnType: Transaction | null
      }>({ method: 'eth_getTransactionByHash', params: [tx.hash] })
    } catch (e) {
      // this is expected to fail in most cases
    }

    if (!transactionData) {
      try {
        transactionData = await publicClient.request({
          method: 'eth_getTransactionByHash',
          params: [tx.hash],
        })
      } catch (e) {
        console.error('Failed to get transaction info')
      }
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

export const registrationGasFeeModifier = (gasLimit: bigint, transactionName: TransactionName) =>
  // this addition is arbitrary, something to do with a gas refund but not 100% sure
  transactionName === 'registerName' ? gasLimit + 5000n : gasLimit

export const calculateGasLimit = async ({
  publicClient,
  walletClient,
  isSafeApp,
  txWithZeroGas,
  transactionName,
}: {
  publicClient: PublicClientWithChain
  walletClient: WalletClient
  isSafeApp: string | boolean | undefined
  txWithZeroGas: BasicTransactionRequest
  transactionName: TransactionName
}) => {
  if (isSafeApp) {
    const accessListResponse = await publicClient.request<{
      Method: 'eth_createAccessList'
      Parameters: [tx: TransactionRequest<Hex>, blockTag: BlockTag]
      ReturnType: AccessListResponse
    }>({
      method: 'eth_createAccessList',
      params: [
        {
          to: txWithZeroGas.to,
          data: txWithZeroGas.data,
          from: walletClient.account!.address,
          value: toHex(txWithZeroGas.value ? txWithZeroGas.value + 1000000n : 0n),
        },
        'latest',
      ],
    })

    return {
      gasLimit: registrationGasFeeModifier(BigInt(accessListResponse.gasUsed), transactionName),
      accessList: accessListResponse.accessList,
    }
  }

  const gasEstimate = await publicClient.estimateGas({
    ...txWithZeroGas,
    account: walletClient.account!,
  })
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
}: ManagedDialogProps) => {
  const { t } = useTranslation()
  const chainName = useChainName()

  const { data: isSafeApp, isLoading: safeAppStatusLoading } = useIsSafeApp()
  const { data: walletClient } = useWalletClientWithAccount()
  const publicClient = usePublicClient()

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
      !!walletClient?.account &&
      !safeAppStatusLoading &&
      !(stage === 'sent' || stage === 'complete') &&
      isUniquenessDefined,
    [transaction, walletClient?.account, safeAppStatusLoading, stage, isUniquenessDefined],
  )

  const queryKey = useQueryKeyFactory({
    params: uniqueTxIdentifiers,
    functionName: 'prepareTransaction',
    queryDependencyType: 'standard',
  })

  const {
    data: request,
    isLoading: requestLoading,
    error: requestError,
  } = useQuery(
    queryKey,
    async ({
      queryKey: [params],
    }): Promise<
      Omit<PrepareSendTransactionResult, 'data'> & {
        data: NonNullable<PrepareSendTransactionResult['data']>
      }
    > => {
      const transactionRequest = await createTransactionRequest({
        name: params.name,
        data: params.data,
        walletClient: walletClient!,
        publicClient,
      })

      const txWithZeroGas = {
        ...transactionRequest,
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
      }

      const { gasLimit, accessList } = await calculateGasLimit({
        publicClient,
        walletClient: walletClient!,
        isSafeApp,
        txWithZeroGas,
        transactionName: transaction.name,
      })

      return {
        ...transactionRequest,
        gas: gasLimit,
        accessList,
        mode: 'prepared',
      }
    },
    {
      enabled: canEnableTransactionRequest,
      onError: console.error,
    },
  )
  useInvalidateOnBlock({
    enabled: canEnableTransactionRequest,
    queryKey,
  })

  const {
    isLoading: transactionLoading,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction({
    ...request,
    onSuccess: transactionSuccessHandler({
      publicClient,
      walletClient: walletClient!,
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

  const errorQueryKey = useQueryKeyFactory({
    params: { hash: transaction.hash, status: transactionStatus },
    functionName: 'getTransactionError',
    queryDependencyType: 'standard',
  })

  const { data: upperError } = useQuery(
    errorQueryKey,
    async ({ queryKey: [{ hash, status }] }) => {
      if (!hash || status !== 'failed') return null
      const a = await publicClient.getTransaction({ hash: transaction.hash! })
      try {
        await publicClient.call({ ...a, to: a.to! })
        return 'transaction.dialog.error.gasLimit'
      } catch (err: unknown) {
        return getReadableError(err)
        // TODO: get revert reason through viem
        // const code = err.data.replace('Reverted ', '')
        // const reason = toUtf8String(`0x${code.substr(138)}`)
        // return reason
      }
    },
    {
      enabled: !!transaction && !!transaction.hash && transactionStatus === 'failed',
    },
  )

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
