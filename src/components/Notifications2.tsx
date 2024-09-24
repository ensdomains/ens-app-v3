import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Toast } from '@ensdomains/thorin'

import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import type { StoredTransaction } from '@app/transaction/slices/createTransactionSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { createEtherscanLink } from '@app/utils/utils'

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
  `,
)

type SuccessOrRevertedTransaction = Extract<StoredTransaction, { status: 'success' | 'reverted' }>

const Notification = ({
  transaction,
  onClose,
  open,
}: {
  transaction: SuccessOrRevertedTransaction | null
  onClose: () => void
  open: boolean
}) => {
  const { t } = useTranslation()
  const router = useRouterWithHistory()
  const breakpoints = useBreakpoint()

  const isFlowResumable = useTransactionManager((s) => s.isFlowResumable)
  const resumeFlow = useTransactionManager((s) => s.resumeFlowWithCheck)

  const resumable = transaction && isFlowResumable(transaction.flowId)

  const button = (() => {
    if (!transaction) return null

    const etherscanLink = createEtherscanLink({
      data: transaction.currentHash,
      chainId: transaction.targetChainId,
    })

    if (!resumable)
      return (
        <a target="_blank" href={etherscanLink} rel="noreferrer">
          <Button size="small" colorStyle="accentSecondary">
            {t('transaction.viewEtherscan')}
          </Button>
        </a>
      )

    return (
      <ButtonContainer>
        <a target="_blank" href={etherscanLink} rel="noreferrer">
          <Button size="small" colorStyle="accentSecondary">
            {t('transaction.viewEtherscan')}
          </Button>
        </a>
        <Button
          size="small"
          data-testid="notification-continue-button"
          onClick={() => resumeFlow(transaction.flowId, router)}
        >
          {t('action.continue')}
        </Button>
      </ButtonContainer>
    )
  })()

  const toastProps = transaction
    ? {
        title: t(`transaction.status.${transaction.status}.notifyTitle`),
        description: t(`transaction.status.${transaction.status}.notifyMessage`, {
          action: t(`transaction.description.${transaction.name}`),
        }),
        children: button,
      }
    : {
        title: '',
      }

  return (
    <Toast
      onClose={onClose}
      open={open}
      variant={breakpoints.sm ? 'desktop' : 'touch'}
      {...toastProps}
    />
  )
}

export const Notifications = () => {
  const [shouldHide, setShouldHide] = useState(false)
  const currentNotification = useTransactionManager((s) => s.currentNotification)
  const dismissNotification = useTransactionManager((s) => s.dismissNotification)

  const open = currentNotification !== null && !shouldHide

  return (
    <Notification
      onClose={() => {
        setShouldHide(true)
        setTimeout(() => {
          dismissNotification()
          setShouldHide(false)
        }, 300)
      }}
      open={open}
      transaction={currentNotification}
    />
  )
}
