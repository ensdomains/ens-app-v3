import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousDistinct } from 'react-use'
import styled, { css } from 'styled-components'

import { Button, Toast } from '@ensdomains/thorin'

import { useTransactionStore } from '@app/transaction-flow/new/TransactionStore'
import type { LastTransactionChange } from '@app/transaction/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { getChainName } from '@app/utils/getChainName'
import { wagmiConfig } from '@app/utils/query/wagmi'
import { makeEtherscanLink } from '@app/utils/utils'

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
  `,
)

type SuccessOrRevertedTransaction = Extract<
  LastTransactionChange,
  { status: 'success' | 'reverted' }
>

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
  const breakpoints = useBreakpoint()
  const getResumable = useTransactionStore((s) => s.flow.getResumable)
  const resumeFlow = useTransactionStore((s) => s.flow.resume)

  const resumable = transaction && getResumable(transaction.flowKey)
  const chainName = transaction && getChainName(wagmiConfig, { chainId: transaction.chainId })

  const button = (() => {
    if (!transaction) return null
    if (!resumable)
      return (
        <a
          target="_blank"
          href={makeEtherscanLink(transaction.currentHash, chainName!)}
          rel="noreferrer"
        >
          <Button size="small" colorStyle="accentSecondary">
            {t('transaction.viewEtherscan')}
          </Button>
        </a>
      )

    return (
      <ButtonContainer>
        <a
          target="_blank"
          href={makeEtherscanLink(transaction.currentHash, chainName!)}
          rel="noreferrer"
        >
          <Button size="small" colorStyle="accentSecondary">
            {t('transaction.viewEtherscan')}
          </Button>
        </a>
        <Button
          size="small"
          data-testid="notification-continue-button"
          onClick={() => resumeFlow(transaction.flowKey)}
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
          action: t(`transaction.description.${transaction.action}`),
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
  const [open, setOpen] = useState(false)
  const [transactionQueue, setTransactionQueue] = useState<SuccessOrRevertedTransaction[]>([])
  const lastTransaction = useTransactionStore((s) => {
    const tx = s.transaction.getLastTransactionChange()
    if (!tx) return null
    if (tx.status !== 'success' && tx.status !== 'reverted') return null
    return tx
  })

  const prevLastTransaction = usePreviousDistinct(lastTransaction)

  if (lastTransaction && prevLastTransaction !== lastTransaction) {
    setTransactionQueue((q) => [...q, lastTransaction])
  }

  const currentTransaction = transactionQueue[0] ?? null

  return (
    <Notification
      onClose={() => {
        setOpen(false)
        setTimeout(
          () => setTransactionQueue((prev) => [...prev.filter((x) => x !== currentTransaction)]),
          300,
        )
      }}
      open={open}
      transaction={currentTransaction}
    />
  )
}
