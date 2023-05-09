import { useTranslation } from 'react-i18next'

import { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { ReturnedENS } from '@app/types'

import BaseWrapButton from './BaseWrapButton'

type Props = {
  name: string
  ownerData: ReturnedENS['getOwner']
  status: NameWrapperState
}

const UnwrapButton = ({ name, ownerData, status }: Props) => {
  const { t } = useTranslation('profile')

  const { address } = useAccountSafely()
  const { createTransactionFlow } = useTransactionFlow()
  const handleUnwrapClick = () => {
    createTransactionFlow(`unwrapName-${name}`, {
      transactions: [makeTransactionItem('unwrapName', { name })],
    })
  }

  const canBeUnwrapped = !!address && ownerData?.owner === address && status !== 'locked'

  if (!canBeUnwrapped) return null

  return (
    <BaseWrapButton data-testid="unwrap-name-btn" onClick={handleUnwrapClick}>
      {t('tabs.more.token.unwrap')}
    </BaseWrapButton>
  )
}

export default UnwrapButton
