import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { ButtonProps } from '@ensdomains/thorin'

import { BannerMessageWithAction } from '@app/components/@atoms/BannerMessageWithAction/BannerMessageWithAction'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ONE_DAY } from '@app/utils/time'

const createKey = (name: string) => `repair-desynced-name-${name}`

// The one day is to ensure the name is extended for at least one day past the calendar day.
const calculateMinSeconds = (date?: Date) => {
  if (!date) return 0
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000) + ONE_DAY)
}

export const DesyncedMessage = ({
  name,
  expiryDate,
  isGracePeriod,
}: {
  name: string
  expiryDate: Date | undefined
  isGracePeriod: boolean
}) => {
  const { t } = useTranslation('profile')
  const { isConnected } = useAccount()
  const { createTransactionFlow, usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  return (
    <BannerMessageWithAction
      content={
        isGracePeriod
          ? t('banner.desynced.descriptionGracePeriod')
          : t('banner.desynced.description')
      }
      button={match(isConnected)
        .with(
          true,
          () =>
            ({
              children: t('banner.desynced.action'),
              colorStyle: 'redPrimary',
              onClick: () => {
                if (!name) return
                const minSeconds = calculateMinSeconds(expiryDate)
                if (minSeconds > 0) {
                  showExtendNamesInput(`extend-names-${name}`, {
                    names: [name],
                    isSelf: true,
                    minSeconds,
                    seconds: minSeconds,
                  })
                } else {
                  createTransactionFlow(createKey(name), {
                    transactions: [createTransactionItem('repairDesyncedName', { name })],
                  })
                }
              },
            }) satisfies ButtonProps,
        )
        .otherwise(() => null)}
    />
  )
}
