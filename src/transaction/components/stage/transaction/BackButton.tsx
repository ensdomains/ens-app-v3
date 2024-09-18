import { useTranslation } from 'react-i18next'

import { Button } from '@ensdomains/thorin'

import { useTransactionStore } from '@app/transaction/transactionStore'
import type { StoredTransactionStatus } from '@app/transaction/types'

export const BackButton = ({
  status,
  backToInput,
}: {
  status: StoredTransactionStatus
  backToInput: boolean
}) => {
  const { t } = useTranslation()
  const setStage = useTransactionStore((s) => s.flow.current.setStage)
  const resetTransactionIndex = useTransactionStore((s) => s.flow.current.resetTransactionIndex)

  if (!backToInput) return null

  if (status === 'waitingForUser' || status === 'pending' || status === 'success') return null

  const handleBackToInput = () => {
    setStage({ stage: 'input' })
    resetTransactionIndex()
  }

  return (
    <Button colorStyle="accentSecondary" onClick={handleBackToInput}>
      {t('action.back')}
    </Button>
  )
}
