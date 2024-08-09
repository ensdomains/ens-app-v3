import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { Banner, Button } from '@ensdomains/thorin'

import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

export const NameExpiryDesyncBanner = ({ normalisedName }: { normalisedName: string }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'banner.expiryDesync' })

  const { isConnected } = useAccount()
  const { createTransactionFlow, resumeTransactionFlow, getResumable } = useTransactionFlow()

  const key = `wrapExpirySync-${normalisedName}`
  const resumable = getResumable(key)

  const handleSyncClick = () => {
    if (resumable) resumeTransactionFlow(key)
    return createTransactionFlow(key, {
      transactions: [createTransactionItem('syncWrappedExpiry', { name: normalisedName })],
    })
  }

  return (
    <Banner
      alert="error"
      title={t('title')}
      actionButton={
        isConnected ? (
          <Button colorStyle="redPrimary" onClick={handleSyncClick}>
            {t('actionLabel')}
          </Button>
        ) : undefined
      }
    >
      {t('description')}
    </Banner>
  )
}
