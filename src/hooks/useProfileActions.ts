import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'

import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'

type Action = {
  onClick: () => void
  label: string
  red?: boolean
  disabled?: boolean
  tooltipContent?: string
  skip2LDEth?: boolean
}

type Props = {
  name: string
  address: string | undefined
  profile: ReturnedENS['getProfile']
  selfAbilities: ReturnType<typeof useSelfAbilities>
  subnameAbilities: ReturnType<typeof useSubnameAbilities>['abilities']
}

export const useProfileActions = ({
  name,
  address,
  profile,
  selfAbilities,
  subnameAbilities,
}: Props) => {
  const { name: primaryName, loading: primaryLoading } = usePrimary(address || '')
  const { createTransactionFlow, showDataInput } = useTransactionFlow()
  const { t } = useTranslation('profile')

  const profileActions = useMemo(() => {
    const actions: Action[] = []
    if (!address) return actions
    if ((selfAbilities.canEdit || profile?.address === address) && primaryName !== name) {
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
            ...(setAsPrimaryTransactions.length > 1
              ? {
                  resumable: true,
                  intro: {
                    title: t('tabs.profile.actions.setAsPrimaryName.title'),
                    content: makeIntroItem('ChangePrimaryName', undefined),
                  },
                }
              : {}),
          }),
      })
    }

    if (selfAbilities.canEdit) {
      actions.push({
        label: t('tabs.profile.actions.editProfile.label'),
        onClick: () =>
          showDataInput(
            `edit-profile-${name}`,
            'ProfileEditor',
            { name },
            { disableBackgroundClick: true },
          ),
      })
    }

    if (subnameAbilities.canDelete && subnameAbilities.canDeleteContract) {
      const action = subnameAbilities.isPCCBurned
        ? {
            label: t('tabs.profile.actions.deleteSubname.label'),
            onClick: () => {
              showDataInput(
                `delete-emancipated-subname-warning-${name}`,
                'DeleteEmancipatedSubnameWarning',
                { name },
              )
            },
            red: true,
            skip2LDEth: true,
          }
        : {
            label: t('tabs.profile.actions.deleteSubname.label'),
            onClick: () =>
              createTransactionFlow(`deleteSubname-${name}`, {
                transactions: [
                  makeTransactionItem('deleteSubname', {
                    name,
                    contract: subnameAbilities.canDeleteContract!,
                    method: subnameAbilities.canDeleteMethod,
                  }),
                ],
              }),
            red: true,
            skip2LDEth: true,
          }
      actions.push(action)
    } else if (subnameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        red: true,
        skip2LDEth: true,
        tooltipContent: t('errors.permissionRevoked'),
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    address,
    createTransactionFlow,
    name,
    primaryName,
    profile?.address,
    selfAbilities.canEdit,
    showDataInput,
    subnameAbilities.canDelete,
    subnameAbilities.canDeleteContract,
    subnameAbilities.canDeleteError,
    subnameAbilities.canDeleteMethod,
    subnameAbilities.isPCCBurned,
    t,
  ])

  return {
    profileActions,
    loading: primaryLoading,
  }
}
