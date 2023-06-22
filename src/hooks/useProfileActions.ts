import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'
import { nameParts } from '@app/utils/name'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { checkAvailablePrimaryName } from './names/useAvailablePrimaryNamesForAddress/utils'
import { useGetPrimaryNameTransactionFlowItem } from './primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from './resolver/useResolverStatus'
import { useNameDetails } from './useNameDetails'
import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'
import useWrapperApprovedForAll from './useWrapperApprovedForAll'

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
  address: string | undefined
  profile: ReturnedENS['getProfile']
  selfAbilities: ReturnType<typeof useSelfAbilities>
  subnameAbilities: ReturnType<typeof useSubnameAbilities>['abilities']
  ownerData: ReturnType<typeof useNameDetails>['ownerData']
  wrapperData: ReturnType<typeof useNameDetails>['wrapperData']
  expiryDate: ReturnType<typeof useNameDetails>['expiryDate']
}

export const useProfileActions = ({
  name,
  address,
  profile,
  selfAbilities,
  subnameAbilities,
  ownerData,
  wrapperData,
  expiryDate,
}: Props) => {
  const { t } = useTranslation('profile')
  const { createTransactionFlow, prepareDataInput } = useTransactionFlow()

  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const resolverStatus = useResolverStatus(name, {
    migratedRecordsMatch: address ? { key: '60', type: 'addr', addr: address } : undefined,
    enabled: !!ownerData,
  })

  const primary = usePrimary(address)

  const wrappedApproved = useWrapperApprovedForAll(
    address || '',
    subnameAbilities.canDelete,
    !!subnameAbilities.canDeleteRequiresWrap,
  )

  const isAvailablePrimaryName = checkAvailablePrimaryName(
    primary.data?.name,
    resolverStatus.data,
  )({
    name,
    isMigrated: !!profile?.isMigrated,
    isResolvedAddress: profile?.address === address,
    isController: !isWrapped && ownerData?.owner === address,
    isWrappedOwner: isWrapped && ownerData?.owner === address,
    expiryDate,
    fuses: wrapperData,
  })

  const getPrimaryNameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: profile?.address,
    resolverAddress: profile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })

  const hasGlobalError = useHasGlobalError()

  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
  const showProfileEditorInput = prepareDataInput('ProfileEditor')
  const showDeleteEmancipatedSubnameWarningInput = prepareDataInput(
    'DeleteEmancipatedSubnameWarning',
  )
  const showDeleteSubnameNotParentWarningInput = prepareDataInput('DeleteSubnameNotParentWarning')

  const isLoading =
    primary.isLoading ||
    resolverStatus.isLoading ||
    getPrimaryNameTransactionFlowItem.isLoading ||
    wrappedApproved.isLoading

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

    if (selfAbilities.canEdit) {
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

    if (subnameAbilities.canDelete && subnameAbilities.canDeleteContract) {
      const base = {
        label: t('tabs.profile.actions.deleteSubname.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        red: true,
        skip2LDEth: true,
      }
      if (subnameAbilities.canDeleteRequiresWrap) {
        const transactions: GenericTransaction[] = [
          makeTransactionItem('wrapName', {
            name,
          }),
          makeTransactionItem('deleteSubname', {
            contract: 'nameWrapper',
            name,
            method: 'setRecord',
          }),
        ]
        if (!wrappedApproved.approvedForAll)
          transactions.unshift(makeTransactionItem('approveNameWrapper', { address }))
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
      } else if (subnameAbilities.isPCCBurned) {
        actions.push({
          ...base,
          onClick: () => {
            showDeleteEmancipatedSubnameWarningInput(`delete-emancipated-subname-warning-${name}`, {
              name,
            })
          },
        })
      } else if (!subnameAbilities.isParentOwner) {
        actions.push({
          ...base,
          onClick: () => {
            showDeleteSubnameNotParentWarningInput(`delete-subname-not-parent-warning-${name}`, {
              name,
              contract: subnameAbilities.canDeleteContract!,
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
                  contract: subnameAbilities.canDeleteContract!,
                  method: subnameAbilities.canDeleteMethod,
                }),
              ],
            }),
        })
      }
    } else if (subnameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        red: true,
        skip2LDEth: true,
        tooltipContent: subnameAbilities.canDeleteError,
      })
    }

    if (subnameAbilities.canReclaim) {
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
    selfAbilities.canEdit,
    subnameAbilities.canDelete,
    subnameAbilities.canDeleteContract,
    subnameAbilities.canDeleteError,
    subnameAbilities.canReclaim,
    subnameAbilities.canDeleteRequiresWrap,
    subnameAbilities.isPCCBurned,
    subnameAbilities.isParentOwner,
    subnameAbilities.canDeleteMethod,
    t,
    hasGlobalError,
    showUnknownLabelsInput,
    createTransactionFlow,
    showProfileEditorInput,
    wrappedApproved.approvedForAll,
    showDeleteEmancipatedSubnameWarningInput,
    showDeleteSubnameNotParentWarningInput,
  ])

  return {
    profileActions,
    loading: isLoading,
  }
}
