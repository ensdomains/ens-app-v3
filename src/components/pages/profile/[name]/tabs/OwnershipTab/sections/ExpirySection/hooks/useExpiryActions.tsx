import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { CalendarSVG, FastForwardSVG } from '@ensdomains/thorin'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { isSelfExtendable } from '@app/hooks/abilities/utils/isSelfExtendable'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import type { useExpiryDetails } from './useExpiryDetails'

type ExpiryAction = {
  label: string
  type: 'set-reminder' | 'extend'
  icon: React.ComponentType
  primary: boolean
  expiryDate?: Date
} & (
  | {
      type: 'extend'
      onClick: () => void
    }
  | {
      type: 'set-reminder'
      expiryDate: Date
    }
)

type UseExpiryActionsReturnType = ExpiryAction[]

export const useExpiryActions = ({
  name,
  expiryDetails,
  ownerData,
  wrapperData,
}: {
  name: string
  expiryDetails: ReturnType<typeof useExpiryDetails>['data']
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
}): UseExpiryActionsReturnType | null => {
  const { t } = useTranslation('common')
  const { address, isConnected } = useAccount()
  const abilities = useAbilities({ name })
  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  const expiryDate = expiryDetails?.find(({ type }) => type === 'expiry')?.date
  if (!expiryDate) return null

  return [
    {
      label: t('action.setReminder'),
      type: 'set-reminder',
      icon: CalendarSVG,
      primary: false,
      expiryDate,
    },
    ...(isConnected && abilities.data?.canExtend
      ? [
          {
            label: t('action.extend'),
            type: 'extend' as const,
            icon: FastForwardSVG,
            primary: true,
            onClick: () => {
              showExtendNamesInput(`extend-names-${name}`, {
                names: [name],
                isSelf: isSelfExtendable({ ownerData, wrapperData, address }),
                hasWrapped: !!wrapperData,
              })
            },
          },
        ]
      : []),
  ] as const
}
