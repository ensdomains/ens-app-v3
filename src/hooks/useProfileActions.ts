import { useQuery } from '@tanstack/react-query'
import { useAccount } from '@web3modal/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

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
  const { account } = useAccount()
  const { name: ensName } = usePrimary(account?.address || '')
  const name = isSelf && ensName ? ensName : _name
  const { profile, ownerData } = useNameDetails(name)
  const selfAbilities = useSelfAbilities(account?.address, ownerData, name)
  const subNameAbilities = useSubnameAbilities(name, ownerData)
  const { createTransactionFlow } = useTransactionFlow()
  const { t } = useTranslation('profile')

  const {
    data: profileActions,
    isLoading,
    status,
    isFetched,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _isFetching,
  } = useQuery(
    [
      'getProfileActions',
      isSelf,
      selfAbilities.canEdit,
      profile?.address,
      subNameAbilities,
      account?.address,
      ensName,
      _name,
      name,
      t,
      createTransactionFlow,
    ],
    () => {
      const actions: { onClick: () => void; color?: Colors; label: string; disabled?: boolean }[] =
        []
      if (
        !isSelf &&
        (selfAbilities.canEdit || profile?.address === account?.address) &&
        ensName !== _name
      ) {
        const setAsPrimaryTransactions: GenericTransaction[] = [
          makeTransactionItem('setPrimaryName', {
            name,
            address: account?.address!,
          }),
        ]
        if (profile?.address !== account?.address) {
          setAsPrimaryTransactions.unshift(
            makeTransactionItem('updateEthAddress', {
              address: account?.address!,
              name,
            }),
          )
        }
        actions.push({
          label: t('tabs.profile.actions.setAsPrimaryName.label'),
          onClick: () =>
            createTransactionFlow(`setPrimaryName-${name}-${account?.address}`, {
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
    },
    {
      enabled: name !== '',
      refetchOnMount: true,
    },
  )

  return {
    profileActions,
    loading: isLoading,
    status,
    isCachedData: status === 'success' && isFetched,
  }
}
