import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'
import { Outlink } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/useChainName'
import { TransactionSubmission } from '@app/types'
import { makeEtherscanLink } from '@app/utils/utils'
import { Button, Dialog, mq, Spinner, Typography } from '@ensdomains/thorin'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { DisplayItems } from './DisplayItems'

const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['4']};
    ${mq.md.min(css`
      min-width: ${theme.space['128']};
    `)}
  `,
)

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
  return (
    <WaitingContainer>
      <StyledSpinner color="accent" />
      <WaitingTextContainer>
        <Typography weight="bold">Awaiting wallet confirmation</Typography>
        <Typography>This will incur network fees</Typography>
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

type Stage = 'request' | 'confirm' | 'complete'

export const TransactionModal = ({
  displayItems,
  open,
  onDismiss,
  onSuccess,
  generateTx,
  actionName,
  completeTitle,
  dismissBtnLabel,
  completeBtnLabel,
}: TransactionSubmission & {
  open: boolean
}) => {
  const { t } = useTranslation()
  const chainName = useChainName()

  const [stage, setStage] = useState<Stage>('request')
  const addTransaction = useAddRecentTransaction()
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const tryTransaction = useCallback(async () => {
    setError(null)
    try {
      const tx = await generateTx()
      addTransaction({
        description: actionName,
        hash: tx.hash,
        confirmations: tx.confirmations || undefined,
      })
      setTxHash(tx.hash)
      setStage('complete')
    } catch (e: any) {
      if (e && e.code === 4001) {
        setError(
          'You rejected the request. Try again or cancel the transaction.',
        )
      } else {
        setError(e ? e.message : 'Unknown error')
      }
    }
  }, [generateTx, actionName, addTransaction])

  const FilledDisplayItems = useMemo(
    () => (
      <DisplayItems
        displayItems={[
          {
            label: 'Action',
            value: t(`transaction.description.${actionName}`),
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
          <CompleteTypography>
            Your transaction was sent to the network. You can close this now if
            you&apos;d like.
          </CompleteTypography>
        </SuccessContent>
      )
    }
    if (stage === 'confirm') {
      return <WaitingElement />
    }
    return null
  }, [stage])

  const LeadingButton = useMemo(() => {
    if (stage !== 'complete') {
      return (
        <ButtonShrinkwrap
          onClick={() => onDismiss?.()}
          variant="secondary"
          tone="grey"
          shadowless
        >
          {dismissBtnLabel || 'Cancel'}
        </ButtonShrinkwrap>
      )
    }
    return null
  }, [stage, dismissBtnLabel, onDismiss])

  const TrailingButton = useMemo(() => {
    if (stage === 'complete') {
      return (
        <Button
          variant="secondary"
          shadowless
          onClick={() => {
            onSuccess?.()
            onDismiss?.()
          }}
        >
          {completeBtnLabel || 'Close'}
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
        >
          Try again
        </Button>
      )
    }
    return (
      <Button shadowless onClick={() => setStage('confirm')}>
        Confirm
      </Button>
    )
  }, [stage, completeBtnLabel, onSuccess, onDismiss, error, tryTransaction])

  const title = useMemo(() => {
    if (stage === 'complete') {
      return completeTitle || 'Transaction Sent'
    }
    if (stage === 'confirm') {
      return 'Confirm in Wallet'
    }
    return 'Transaction Request'
  }, [completeTitle, stage])

  useEffect(() => {
    if (open) {
      setStage('request')
      setError(null)
      setTxHash(null)
    }
  }, [open])

  useEffect(() => {
    if (stage === 'confirm') {
      tryTransaction()
    }
  }, [stage, tryTransaction])

  return (
    <Dialog
      title={title}
      subtitle={
        stage === 'request'
          ? 'Confirm the details of the transaction'
          : undefined
      }
      variant="actionable"
      leading={LeadingButton}
      trailing={TrailingButton}
      open={open}
      onDismiss={() => {}}
    >
      <InnerDialog>
        {error ? (
          <ErrorTypography color="red">{error}</ErrorTypography>
        ) : (
          MiddleContent
        )}
        {FilledDisplayItems}
        {stage === 'complete' && (
          <Outlink href={makeEtherscanLink(txHash!, chainName)}>
            View on Etherscan
          </Outlink>
        )}
      </InnerDialog>
    </Dialog>
  )
}
