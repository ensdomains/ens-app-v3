import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink, StyledAnchor } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/useChainName'
import { getRoute } from '@app/routes'
import { transactions } from '@app/transaction-flow/transaction'
import { ManagedDialogProps } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { isIOS } from '@app/utils/isIOS'
import { makeEtherscanLink } from '@app/utils/utils'
import { Button, Dialog, mq, Spinner, Typography } from '@ensdomains/thorin'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { PopulatedTransaction } from 'ethers'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled, { css } from 'styled-components'
import { useSigner } from 'wagmi'
import { DisplayItems } from '../DisplayItems'

const ButtonShrinkwrap = styled(Button)(
  () => css`
    width: 80%;
    flex-shrink: 1;
    ${mq.md.min(css`
      width: 100%;
    `)}
  `,
)

const WaitingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['3']};
  `,
)

const WaitingTextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    color: ${theme.colors.textSecondary};
  `,
)

const StyledSpinner = styled(Spinner)(
  ({ theme }) => css`
    width: ${theme.space['9']};
    height: ${theme.space['9']};
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
    width: 100%;
    text-align: center;
  `,
)

const SuccessContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    text-align: center;
  `,
)

const CompleteTypography = styled(Typography)(
  ({ theme }) => css`
    max-width: ${theme.space['80']};
  `,
)

type Stage = 'preSteps' | 'request' | 'confirm' | 'complete'

export const TransactionStageModal = ({
  displayItems,
  onDismiss,
  onSuccess,
  transaction,
  actionName,
  completeTitle,
  dismissBtnLabel,
  completeBtnLabel,
  currentStep,
  stepCount,
  onComplete,
  txKey,
}: ManagedDialogProps & {
  txKey: string | null
  currentStep: number
  stepCount: number
  onComplete: () => void
}) => {
  const { t } = useTranslation()
  const chainName = useChainName()
  const router = useRouter()

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
      let _populatedTransaction: PopulatedTransaction

      try {
        _populatedTransaction = await transactions[transaction.name].transaction(
          signer as JsonRpcSigner,
          ens,
          transaction.data,
        )
        _populatedTransaction.gasLimit = await signer!.estimateGas(_populatedTransaction)
        return _populatedTransaction
      } catch (e: any) {
        setError(e.message || e)
        return null
      }
    },
    {
      enabled: !!transaction && !!signer && !!ens,
    },
  )

  const needsUnchecked = isIOS()

  const tryTransaction = useCallback(async () => {
    setError(null)
    try {
      let hash: string
      if (needsUnchecked) {
        hash = await (signer as JsonRpcSigner).sendUncheckedTransaction(populatedTransaction!)
      } else {
        ;({ hash } = await (signer as JsonRpcSigner).sendTransaction(populatedTransaction!))
      }
      if (!hash) throw new Error('No transaction generated')
      addTransaction({
        description: JSON.stringify({ action: actionName, key: txKey }),
        hash,
      })
      setTxHash(hash)
      setStage('complete')
      onComplete()
    } catch (e: any) {
      if (e && e.code === 4001) {
        setError('transaction.dialog.confirm.error.rejectedRequest')
      } else {
        setError(e ? e.message : 'transaction.dialog.confirm.error.unknown')
      }
    }
  }, [needsUnchecked, addTransaction, actionName, txKey, onComplete, signer, populatedTransaction])

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
    [t, actionName, displayItems],
  )
  const MiddleContent = useMemo(() => {
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
          variant={final ? 'secondary' : 'primary'}
          shadowless
          onClick={() => {
            onSuccess?.()
            if (final) onDismiss?.()
          }}
          data-testid="transaction-modal-complete-trailing-btn"
        >
          {completeBtnLabel ||
            (final
              ? t('transaction.dialog.complete.trailingButton')
              : t('transaction.dialog.complete.stepTrailingButton'))}
        </Button>
      )
    }
    if (stage === 'confirm') {
      return (
        <Button
          disabled={!error}
          shadowless
          variant="secondary"
          onClick={() => tryTransaction()}
          data-testid="transaction-modal-confirm-trailing-btn"
        >
          {t('transaction.dialog.confirm.trailingButton')}
        </Button>
      )
    }
    return (
      <Button
        data-testid="transaction-modal-request-trailing-btn"
        shadowless
        onClick={() => setStage('confirm')}
        disabled={!populatedTransaction}
      >
        {t('transaction.dialog.request.trailingButton')}
      </Button>
    )
  }, [
    stage,
    populatedTransaction,
    t,
    currentStep,
    stepCount,
    completeBtnLabel,
    onSuccess,
    onDismiss,
    error,
    tryTransaction,
  ])

  const title = useMemo(() => {
    if (stage === 'complete') {
      if (stepCount > 1) {
        return (
          completeTitle || t('transaction.dialog.complete.stepTitle', { step: currentStep + 1 })
        )
      }
      return completeTitle || t('transaction.dialog.complete.title')
    }
    if (stage === 'confirm') {
      return t('transaction.dialog.confirm.title')
    }
    return t('transaction.dialog.request.title')
  }, [completeTitle, currentStep, stage, stepCount, t])

  useEffect(() => {
    setStage('request')
    setError(null)
    setTxHash(null)
  }, [])

  useEffect(() => {
    if (stage === 'confirm') {
      tryTransaction()
    }
  }, [stage, tryTransaction])

  const stepStatus = useMemo(() => {
    if (stage === 'complete') {
      return 'completed'
    }
    return 'inProgress'
  }, [stage])

  return (
    <>
      <Dialog.Heading
        title={title}
        subtitle={stage === 'request' ? t('transaction.dialog.request.subtitle') : undefined}
        currentStep={currentStep}
        stepCount={stepCount > 1 ? stepCount : undefined}
        stepStatus={stepStatus}
      />
      <InnerDialog data-testid="transaction-modal-inner">
        {error ? <ErrorTypography color="red">{t(error)}</ErrorTypography> : MiddleContent}
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
