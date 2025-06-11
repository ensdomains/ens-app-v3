import { useTranslation } from 'react-i18next'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { CalendarSVG, FastForwardSVG } from '@ensdomains/thorin'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { nameLevel } from '@app/utils/name'

import type { useExpiryDetails } from './useExpiryDetails'

export const isSelfExtendable = ({
  ownerData,
  wrapperData,
  address,
}: {
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  address?: Address
}) => {
  return ownerData?.registrant === address || wrapperData?.owner === address
}

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
  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  // TODO: remove this when we add support for extending wrapped subnames
  const is2ld = nameLevel(name) === '2ld'

  const expiryDate = expiryDetails?.find(({ type }) => type === 'expiry')?.date
  if (!expiryDate || !is2ld) return null
  return [
    {
      label: t('action.setReminder'),
      type: 'set-reminder',
      icon: CalendarSVG,
      primary: false,
      expiryDate,
    },
    ...(isConnected
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
              })
            },
          },
        ]
      : []),
  ] as const
}
