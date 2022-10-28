import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import type { Colors } from '@ensdomains/thorin'

import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'

import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'

export const useProfileActions = () => {
  const router = useRouter()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'

  const { address } = useAccount()
  const { name: ensName, loading: primaryLoading } = usePrimary(address || '')
  const name = isSelf && ensName ? ensName : _name

  const { profile, ownerData, isLoading: detailsLoading } = useNameDetails(name)

  const selfAbilities = useSelfAbilities(address, ownerData, name)
  const subNameAbilities = useSubnameAbilities(name, ownerData)

  const { createTransactionFlow } = useTransactionFlow()
  const { t } = useTranslation('profile')

  const profileActions = useMemo(() => {
    const actions: { onClick: () => void; color?: Colors; label: string; disabled?: boolean }[] = []
    if (!isSelf && (selfAbilities.canEdit || profile?.address === address) && ensName !== _name) {
      const setAsPrimaryTransactions: GenericTransaction[] = [
        makeTransactionItem('setPrimaryName', {
          name,
          address: address!,
        }),
      ]
      if (profile?.address !== address) {
        setAsPrimaryTransactions.unshift(
          makeTransactionItem('updateEthAddress', {
            address: address!,
            name,
          }),
        )
      }
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        onClick: () =>
          createTransactionFlow(`setPrimaryName-${name}-${address}`, {
            transactions: setAsPrimaryTransactions,
            resumable: true,
            intro:
              setAsPrimaryTransactions.length > 1
                ? {
                    title: t('tabs.profile.actions.setAsPrimaryName.title'),
                    content: makeIntroItem('ChangePrimaryName', undefined),
                  }
                : undefined,
          }),
      })
    }

    if (subNameAbilities.canDelete && subNameAbilities.canDeleteContract) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () =>
          createTransactionFlow(`deleteSubname-${name}`, {
            transactions: [
              makeTransactionItem('deleteSubname', {
                name,
                contract: subNameAbilities.canDeleteContract!,
              }),
            ],
          }),
        color: 'red',
      })
    }

    if (subNameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        color: 'red',
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    _name,
    address,
    createTransactionFlow,
    ensName,
    isSelf,
    name,
    profile?.address,
    selfAbilities.canEdit,
    subNameAbilities.canDelete,
    subNameAbilities.canDeleteContract,
    subNameAbilities.canDeleteError,
    t,
  ])

  return {
    profileActions,
    loading: primaryLoading || detailsLoading,
  }
}
