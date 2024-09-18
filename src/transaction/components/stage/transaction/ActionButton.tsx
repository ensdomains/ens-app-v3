import { useTranslation } from 'react-i18next'

import { Button, Spinner } from '@ensdomains/thorin'

import type { StoredTransactionStatus } from '@app/transaction/types'

type TransactionModalActionButtonProps = {
  status: StoredTransactionStatus
  currentTransactionIndex: number
  transactionCount: number
  onDismiss: () => void
  sendTransaction: () => void
  incrementTransaction: () => void
  canEnableTransactionRequest: boolean
  requestLoading: boolean
  requestExists: boolean
  transactionLoading: boolean
  isTransactionRequestCachedData: boolean
  requestErrorExists: boolean
}

export const TransactionModalActionButton = ({
  status,
  currentTransactionIndex,
  transactionCount,
  onDismiss,
  sendTransaction,
  incrementTransaction,
  canEnableTransactionRequest,
  requestLoading,
  requestExists,
  transactionLoading,
  isTransactionRequestCachedData,
  requestErrorExists,
}: TransactionModalActionButtonProps) => {
  const { t } = useTranslation()

  if (status === 'success') {
    const final = currentTransactionIndex + 1 === transactionCount

    if (final) {
      return (
        <Button
          data-testid="transaction-modal-complete-button"
          onClick={onDismiss}
          colorStyle="accentSecondary"
        >
          {t('action.done')}
        </Button>
      )
    }
    return (
      <Button data-testid="transaction-modal-complete-button" onClick={incrementTransaction}>
        {t('action.next')}
      </Button>
    )
  }
  if (status === 'reverted') {
    return (
      <Button
        onClick={sendTransaction}
        disabled={!canEnableTransactionRequest || requestLoading || !requestExists}
        colorStyle="redSecondary"
        data-testid="transaction-modal-failed-button"
      >
        {t('action.tryAgain')}
      </Button>
    )
  }
  if (status === 'pending') {
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
        !requestExists ||
        !!requestErrorExists ||
        isTransactionRequestCachedData
      }
      onClick={sendTransaction}
      data-testid="transaction-modal-confirm-button"
    >
      {t('transaction.dialog.confirm.openWallet')}
    </Button>
  )
}
