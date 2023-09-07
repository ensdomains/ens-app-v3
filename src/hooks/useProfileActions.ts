import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Address } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'
import { Profile } from '@app/types'
import { checkAvailablePrimaryName } from '@app/utils/checkAvailablePrimaryName'
import { nameParts } from '@app/utils/name'

import { useAbilities } from './abilities/useAbilities'
import { usePrimaryName } from './ensjs/public/usePrimaryName'
import { useHasGlobalError } from './errors/useHasGlobalError'
import { useGetPrimaryNameTransactionFlowItem } from './primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from './resolver/useResolverStatus'

type Action = {
  onClick: () => void
  label: string
  red?: boolean
  disabled?: boolean
  tooltipContent?: string
  tooltipPlacement?: 'left' | 'right'
  skip2LDEth?: boolean
  warning?: string
  fullMobileWidth?: boolean
}

type Props = {
  name: string
  address: Address | undefined
  profile: Profile | undefined
  abilities: ReturnType<typeof useAbilities>['data']
  ownerData: GetOwnerReturnType | undefined
  wrapperData: GetWrapperDataReturnType | undefined
  expiryDate: Date | undefined
}

export const useProfileActions = ({
  name,
  address,
  profile,
  abilities,
  ownerData,
  wrapperData,
  expiryDate,
}: Props) => {
  const { t } = useTranslation('profile')
  const { createTransactionFlow, usePreparedDataInput } = useTransactionFlow()

  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const resolverStatus = useResolverStatus({
    name,
    migratedRecordsMatch: address
      ? { type: 'address', match: { id: 60, value: address } }
      : undefined,
    enabled: !!ownerData,
  })

  const primary = usePrimaryName({ address })

  const isAvailablePrimaryName = checkAvailablePrimaryName(
    primary.data?.name,
    resolverStatus.data,
  )({
    name,
    relation: {
      owner: ownerData?.owner === address,
      registrant: ownerData?.registrant === address,
      resolvedAddress: profile?.address === address,
      wrappedOwner: ownerData?.ownershipLevel === 'nameWrapper' && ownerData?.owner === address,
    },
    expiryDate,
    fuses: wrapperData?.fuses || null,
    isMigrated: !!profile?.isMigrated,
  })

  const getPrimaryNameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: profile?.address,
    resolverAddress: profile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })

  const hasGlobalError = useHasGlobalError()

  const showUnknownLabelsInput = usePreparedDataInput('UnknownLabels')
  const showProfileEditorInput = usePreparedDataInput('ProfileEditor')
  const showDeleteEmancipatedSubnameWarningInput = usePreparedDataInput(
    'DeleteEmancipatedSubnameWarning',
  )
  const showDeleteSubnameNotParentWarningInput = usePreparedDataInput(
    'DeleteSubnameNotParentWarning',
  )

  const isLoading =
    primary.isLoading || resolverStatus.isLoading || getPrimaryNameTransactionFlowItem.isLoading

  const profileActions = useMemo(() => {
    const actions: Action[] = []
    if (!address || isLoading) return actions

    const transactionFlowItem = getPrimaryNameTransactionFlowItem?.callBack?.(name)
    if (isAvailablePrimaryName && !!transactionFlowItem) {
      const key = `setPrimaryName-${name}-${address}`
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        onClick: !checkIsDecrypted(name)
          ? () =>
              showUnknownLabelsInput(key, {
                name,
                key,
                transactionFlowItem,
              })
          : () => createTransactionFlow(key, transactionFlowItem),
      })
    }

    if (abilities.canEdit && (abilities.canEditRecords || abilities.canEditResolver)) {
      actions.push({
        label: t('tabs.profile.actions.editProfile.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        onClick: () =>
          showProfileEditorInput(
            `edit-profile-${name}`,
            { name },
            { disableBackgroundClick: true },
          ),
      })
    }

    if (abilities.canDelete && abilities.canDeleteContract) {
      const base = {
        label: t('tabs.profile.actions.deleteSubname.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        red: true,
        skip2LDEth: true,
      }
      if (abilities.canDeleteRequiresWrap) {
        const transactions: GenericTransaction[] = [
          makeTransactionItem('transferSubname', {
            name,
            contract: 'nameWrapper',
            newOwnerAddress: address,
          }),
          makeTransactionItem('deleteSubname', {
            contract: 'nameWrapper',
            name,
            method: 'setRecord',
          }),
        ]
        actions.push({
          ...base,
          onClick: () =>
            createTransactionFlow(`deleteSubname-${name}`, {
              transactions,
              resumable: true,
              intro: {
                title: ['intro.multiStepSubnameDelete.title', { ns: 'transactionFlow' }],
                content: makeIntroItem('GenericWithDescription', {
                  description: t('intro.multiStepSubnameDelete.description', {
                    ns: 'transactionFlow',
                  }),
                }),
              },
            }),
        })
      } else if (abilities.isPCCBurned) {
        actions.push({
          ...base,
          onClick: () => {
            showDeleteEmancipatedSubnameWarningInput(`delete-emancipated-subname-warning-${name}`, {
              name,
            })
          },
        })
      } else if (!abilities.isParentOwner) {
        actions.push({
          ...base,
          onClick: () => {
            showDeleteSubnameNotParentWarningInput(`delete-subname-not-parent-warning-${name}`, {
              name,
              contract: abilities.canDeleteContract!,
            })
          },
        })
      } else {
        actions.push({
          ...base,
          onClick: () =>
            createTransactionFlow(`deleteSubname-${name}`, {
              transactions: [
                makeTransactionItem('deleteSubname', {
                  name,
                  contract: abilities.canDeleteContract!,
                  method: abilities.canDeleteMethod,
                }),
              ],
            }),
        })
      }
    } else if (abilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        red: true,
        skip2LDEth: true,
        tooltipContent: abilities.canDeleteError,
      })
    }

    if (abilities.canReclaim) {
      const { label, parent } = nameParts(name)
      actions.push({
        label: t('tabs.profile.actions.reclaim.label'),
        warning: t('tabs.profile.actions.reclaim.warning'),
        fullMobileWidth: true,
        onClick: () => {
          createTransactionFlow(`reclaim-${name}`, {
            transactions: [
              makeTransactionItem('createSubname', {
                contract: 'nameWrapper',
                label,
                parent,
              }),
            ],
          })
        },
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    address,
    isLoading,
    getPrimaryNameTransactionFlowItem,
    name,
    isAvailablePrimaryName,
    abilities.canEdit,
    abilities.canEditRecords,
    abilities.canEditResolver,
    abilities.canDelete,
    abilities.canDeleteContract,
    abilities.canDeleteError,
    abilities.canReclaim,
    abilities.canDeleteRequiresWrap,
    abilities.isPCCBurned,
    abilities.isParentOwner,
    abilities.canDeleteMethod,
    t,
    hasGlobalError,
    showUnknownLabelsInput,
    createTransactionFlow,
    showProfileEditorInput,
    showDeleteEmancipatedSubnameWarningInput,
    showDeleteSubnameNotParentWarningInput,
  ])

  return {
    profileActions,
    loading: isLoading,
  }
}
