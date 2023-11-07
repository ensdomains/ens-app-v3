import { useTranslation } from 'react-i18next'

import { CalendarSVG, FastForwardSVG } from '@ensdomains/thorin2'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { nameLevel } from '@app/utils/name'

import type { useExpiryDetails } from './useExpiryDetails'

export const useExpiryActions = ({
  name,
  expiryDetails,
}: {
  name: string
  expiryDetails: ReturnType<typeof useExpiryDetails>['data']
}) => {
  const { t } = useTranslation('common')
  const abilities = useAbilities({ name })
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
      icon: <CalendarSVG />,
      primary: false,
      expiryDate,
    },
    {
      label: t('action.extend'),
      type: 'extend',
      icon: <FastForwardSVG />,
      primary: true,
      onClick: () => {
        showExtendNamesInput(`extend-names-${name}`, {
          names: [name],
          isSelf: abilities.data?.canEdit,
        })
      },
    },
  ] as const
}
