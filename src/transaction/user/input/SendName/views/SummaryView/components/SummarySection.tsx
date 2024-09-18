import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ExpandableSection } from '@app/components/@atoms/ExpandableSection/ExpandableSection'
import { shortenAddress } from '@app/utils/utils'

import type { SendNameForm } from '../../../SendName-flow'

export const SummarySection = () => {
  const { t } = useTranslation('transactionFlow')
  const { watch } = useFormContext<SendNameForm>()
  const recipient = watch('recipient')
  const transactions = watch('transactions')
  const shortenedAddress = shortenAddress(recipient)
  return (
    <ExpandableSection title={t('input.sendName.views.summary.fields.summary.title')}>
      {transactions.sendOwner && (
        <div data-testid="send-name-summary-owner">
          {t('input.sendName.views.summary.fields.summary.updates.role', {
            role: 'Owner',
            address: shortenedAddress,
          })}
        </div>
      )}
      {transactions.sendManager && (
        <div data-testid="send-name-summary-manager">
          {t('input.sendName.views.summary.fields.summary.updates.role', {
            role: 'Manager',
            address: shortenedAddress,
          })}
        </div>
      )}
      {transactions.setEthRecord && (
        <div data-testid="send-name-summary-eth-record">
          {t('input.sendName.views.summary.fields.summary.updates.eth-record', {
            address: shortenedAddress,
          })}
        </div>
      )}
      {transactions.resetProfile && (
        <div data-testid="send-name-summary-reset-profile">
          {t('input.sendName.views.summary.fields.summary.remove.profile')}
        </div>
      )}
    </ExpandableSection>
  )
}
