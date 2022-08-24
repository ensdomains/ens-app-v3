import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'
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
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { PopulatedTransaction } from 'ethers'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useProvider, useQuery, useSendTransaction, useSigner } from 'wagmi'
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

const WaitingElement = () => {
  const { t } = useTranslation()

  return (
    <WaitingContainer data-testid="transaction-waiting-container">
      <StyledSpinner color="accent" />
      <WaitingTextContainer>
        <Typography weight="bold">{t('transaction.dialog.confirm.waiting.title')}</Typography>
        <Typography>{t('transaction.dialog.confirm.waiting.subtitle')}</Typography>
      </WaitingTextContainer>
    </WaitingContainer>
  )
}

const ErrorTypography = styled(Typography)(
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

const CompleteTypography = styled(Typography)(
  ({ theme }) => css`
    max-width: ${theme.space['80']};
  `,
)

type Stage = 'request' | 'confirm' | 'complete'

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

  const addTransaction = useAddRecentTransaction()
  const { data: signer } = useSigner()
  const ens = useEns()

  const [stage, setStage] = useState<Stage>('request')
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const settingsRoute = getRoute('settings')

  const { data: populatedTransaction } = useQuery(
    ['tx', txKey, currentStep],
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

  const tryTransaction = useCallback(async () => {
    setError(null)
    try {
      const { hash } = await (signer as JsonRpcSigner).sendTransaction(populatedTransaction!)
      if (!hash) throw new Error('No transaction generated')
      addTransaction({
        description: JSON.stringify({ action: actionName, key: txKey }),
        hash,
      })
      setTxHash(hash)
      setStage('mining')
    } catch (e: any) {
      if (e && e.code === 4001) {
        setError('transaction.dialog.confirm.error.rejectedRequest')
      } else {
        setError(e ? e.message : 'transaction.dialog.confirm.error.unknown')
      }
    }
  }, [addTransaction, actionName, txKey, signer, populatedTransaction])

  const FilledDisplayItems = useMemo(
    () => <DisplayItems displayItems={displayItems || []} />,
    [displayItems],
  )
  const MiddleContent = useMemo(() => {
    if (stage === 'mining') {
      return (
        <SuccessContent>
          <WaitingElementMining {...{ txHash }} />
          <Spacer $height="1" />
          <Typography>{t('transaction.dialog.mining.message')}</Typography>
        </SuccessContent>
      )
    }
    if (stage === 'complete') {
      return (
        <SuccessContent>
          <PaperPlaneColourSVG />
          <CompleteTypography>{t('transaction.dialog.complete.message')}</CompleteTypography>
          <StyledAnchor
            onClick={() => {
              onDismiss?.()
              router.push(settingsRoute.href)
            }}
          >
            View your transactions
          </StyledAnchor>
        </SuccessContent>
      )
    }
    if (stage === 'confirm') {
      return <WaitingElement />
    }
    return null
  }, [onDismiss, router, settingsRoute.href, stage, t])

  const LeadingButton = useMemo(() => {
    let label: string
    if (stage === 'complete') {
      if (currentStep + 1 === stepCount) return null
      label = t('action.close')
    } else if (dismissBtnLabel) {
      label = dismissBtnLabel
    } else {
      label = t('action.cancel')
    }
    return (
      <ButtonShrinkwrap
        onClick={() => {
          if (stage === 'complete') onSuccess?.()
          onDismiss?.()
        }}
        variant="secondary"
        tone="grey"
        shadowless
        data-testid="transaction-modal-dismiss-btn"
      >
        {label}
      </ButtonShrinkwrap>
    )
  }, [stage, dismissBtnLabel, currentStep, stepCount, t, onDismiss, onSuccess])

  const TrailingButton = useMemo(() => {
    if (stage === 'complete') {
      const final = currentStep + 1 === stepCount

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
          onClick={() => {
            tryTransaction()
          }}
          data-testid="transaction-modal-confirm-trailing-btn"
        >
          {t('transaction.dialog.confirm.trailingButton')}
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
        {stage === 'complete' && (
          <Outlink href={makeEtherscanLink(txHash!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        )}
      </InnerDialog>
      <Dialog.Footer leading={LeadingButton} trailing={TrailingButton} />
    </>
  )
}
