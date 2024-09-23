import { useTranslation } from 'react-i18next'

import { Button } from '@ensdomains/thorin'

import type { StoredTransactionStatus } from '@app/transaction/slices/createTransactionSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'

export const BackButton = ({
  status,
  backToInput,
}: {
  status: StoredTransactionStatus
  backToInput: boolean
}) => {
  const { t } = useTranslation()
  const setStage = useTransactionManager((s) => s.setCurrentFlowStage)
  const resetTransactionIndex = useTransactionManager((s) => s.resetCurrentFlowTransactionIndex)

  if (!backToInput) return null

  if (status === 'waitingForUser' || status === 'pending' || status === 'success') return null

  const handleBackToInput = () => {
    setStage('input')
    resetTransactionIndex()
  }

  return (
    <Button colorStyle="accentSecondary" onClick={handleBackToInput}>
      {t('action.back')}
    </Button>
  )
}
