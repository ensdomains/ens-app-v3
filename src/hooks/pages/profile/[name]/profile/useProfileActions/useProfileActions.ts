import { ComponentProps, useMemo } from 'react'
import { TFunction, useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils'
import type { Button } from '@ensdomains/thorin'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { useOwner } from '@app/hooks/ensjs/public/useOwner'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useWrapperData } from '@app/hooks/ensjs/public/useWrapperData'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useProfile } from '@app/hooks/useProfile'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { GenericTransaction } from '@app/transaction-flow/types'
import { checkAvailablePrimaryName } from '@app/utils/checkAvailablePrimaryName'
import { nameParts } from '@app/utils/name'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'

type Action = {
  onClick: () => void
  label: string
  red?: boolean
  disabled?: boolean
  tooltipContent?: string
  tooltipPlacement?: 'left' | 'right' | 'top'
  skip2LDEth?: boolean
  warning?: string
  fullMobileWidth?: boolean
  loading?: boolean
} & Omit<ComponentProps<typeof Button>, 'children'>

type Props = {
  name: string
  enabled?: boolean
}

const editButtonTooltip = ({
  hasGraphError,
  canEdit,
  canEditRecords,
  canEditResolver,
  t,
}: {
  hasGraphError: boolean
  canEdit: boolean
  canEditRecords: boolean
  canEditResolver: boolean
  t: TFunction
}) => {
  if (hasGraphError) return t('errors.networkError.blurb', { ns: 'common' })
  if (!canEdit) return t('errors.isOwnerCannotEdit')
  if (!canEditRecords && !canEditResolver) return t('errors.cannotEdit')
  return undefined
}

const verificationsButtonTooltip = ({
  hasGraphError,
  canEdit,
  canEditRecords,
  t,
}: {
  hasGraphError: boolean
  canEdit: boolean
  canEditRecords: boolean
  t: TFunction
}) => {
  if (hasGraphError) return t('errors.networkError.blurb', { ns: 'common' })
  if (!canEdit) return t('errors.isOwnerCannotVerify')
  if (!canEditRecords) return t('errors.cannotVerify')
  return undefined
}

export const useProfileActions = ({ name, enabled: enabled_ = true }: Props) => {
  const { t } = useTranslation('profile')
  const { createTransactionFlow, usePreparedDataInput } = useTransactionFlow()

  const { address } = useAccountSafely()

  const enabled = enabled_ && !!address

  const { data: abilities, isLoading: isAbilitiesLoading } = useAbilities({ name, enabled })

  const { data: profile, isLoading: isProfileLoading } = useProfile({ name, enabled })
  const { data: ownerData, isLoading: isOwnerLoading } = useOwner({ name, enabled })
  const { data: wrapperData, isLoading: isWrapperDataLoading } = useWrapperData({ name, enabled })
  const { data: expiryData, isLoading: isExpiryLoading } = useExpiry({ name, enabled })
  const expiryDate = expiryData?.expiry?.date

  const { data: resolverStatus, isLoading: isResolverStatusLoading } = useResolverStatus({
    name,
    migratedRecordsMatch: address
      ? { type: 'address', match: { id: 60, value: address } }
      : undefined,
    enabled: enabled && !!ownerData,
  })

  const { data: primaryData, isLoading: isPrimaryNameLoading } = usePrimaryName({
    address,
    enabled,
  })

  const isAvailablePrimaryName = checkAvailablePrimaryName(
    primaryData?.name,
    resolverStatus,
  )({
    name,
    relation: {
      owner: ownerData?.owner === address,
      registrant: ownerData?.registrant === address,
      resolvedAddress: profile?.address === address,
      wrappedOwner: wrapperData?.owner === address,
    },
    expiryDate,
    fuses: wrapperData?.fuses || null,
    isMigrated: profile?.isMigrated !== false,
  })

  const isWrapped = !!wrapperData

  const getPrimaryNameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: profile?.address,
    resolverAddress: profile?.resolverAddress,
    resolverStatus,
  })

  const { data: hasGraphError, isLoading: hasGraphErrorLoading } = useHasGraphError()

  const showUnknownLabelsInput = usePreparedDataInput('UnknownLabels')
  const showProfileEditorInput = usePreparedDataInput('ProfileEditor')
  const showProfileReclaimInput = usePreparedDataInput('ProfileReclaim')
  const showDeleteEmancipatedSubnameWarningInput = usePreparedDataInput(
    'DeleteEmancipatedSubnameWarning',
  )
  const showDeleteSubnameNotParentWarningInput = usePreparedDataInput(
    'DeleteSubnameNotParentWarning',
  )
  const showVerifyProfileInput = usePreparedDataInput('VerifyProfile')

  const isLoading =
    isAbilitiesLoading ||
    isProfileLoading ||
    isOwnerLoading ||
    isWrapperDataLoading ||
    isExpiryLoading ||
    isPrimaryNameLoading ||
    isResolverStatusLoading ||
    getPrimaryNameTransactionFlowItem.isLoading

  const profileActions = useMemo(() => {
    const actions: Action[] = []
    if (!address || isLoading) return actions

    const isOwnerOrManager = address === ownerData?.owner || ownerData?.registrant === address

    if (isOwnerOrManager) {
      actions.push({
        label: t('tabs.profile.actions.verifyProfile.label'),
        tooltipContent: verificationsButtonTooltip({
          hasGraphError: !!hasGraphError,
          canEdit: abilities.canEdit,
          canEditRecords: abilities.canEditRecords,
          t,
        }),
        tooltipPlacement: 'top',
        loading: hasGraphErrorLoading,
        colorStyle: 'accentSecondary',
        onClick: () => showVerifyProfileInput(`verify-profile-${name}`, { name }),
      })
    }

    const transactionFlowItem = getPrimaryNameTransactionFlowItem?.callBack?.(name)
    if (isAvailablePrimaryName && !!transactionFlowItem) {
      const key = `setPrimaryName-${name}-${address}`
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        tooltipContent: hasGraphError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        loading: hasGraphErrorLoading,
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

    if (isOwnerOrManager) {
      actions.push({
        label: t('tabs.profile.actions.editProfile.label'),
        tooltipContent: editButtonTooltip({
          hasGraphError: !!hasGraphError,
          canEdit: abilities.canEdit,
          canEditRecords: abilities.canEditRecords,
          canEditResolver: abilities.canEditResolver,
          t,
        }),
        tooltipPlacement: 'left',
        loading: hasGraphErrorLoading,
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
        tooltipContent: hasGraphError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        red: true,
        skip2LDEth: true,
        loading: hasGraphErrorLoading,
      }
      if (abilities.canDeleteRequiresWrap) {
        const transactions: GenericTransaction[] = [
          createTransactionItem('transferSubname', {
            name,
            contract: 'nameWrapper',
            newOwnerAddress: address,
          }),
          createTransactionItem('deleteSubname', {
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
                createTransactionItem('deleteSubname', {
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
        loading: hasGraphErrorLoading,
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
        loading: hasGraphErrorLoading,
        onClick: () => {
          showProfileReclaimInput(
            `reclaim-profile-${name}`,
            { name, label, parent },
            { disableBackgroundClick: true },
          )
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
    hasGraphError,
    hasGraphErrorLoading,
    ownerData?.owner,
    ownerData?.registrant,
    createTransactionFlow,
    showUnknownLabelsInput,
    showProfileReclaimInput,
    showProfileEditorInput,
    showDeleteEmancipatedSubnameWarningInput,
    showDeleteSubnameNotParentWarningInput,
    showVerifyProfileInput,
  ])

  return {
    profileActions,
    isLoading,
  }
}
