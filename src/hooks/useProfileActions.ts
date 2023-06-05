import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction, TransactionFlowItem } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'
import { nameParts } from '@app/utils/name'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { useResolverStatus } from './resolver/useResolverStatus'
import { useNameDetails } from './useNameDetails'
import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'

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
  chainId: number
}

export const useProfileActions = ({
  name,
  address,
  profile,
  selfAbilities,
  subnameAbilities,
  ownerData,
  chainId,
}: Props) => {
  const { t } = useTranslation('profile')
  const { createTransactionFlow, prepareDataInput } = useTransactionFlow()

  const latestResolverAddress = RESOLVER_ADDRESSES[`${chainId}`]?.[0]
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const { data: resolverStatus, isLoading: isResolverStatusLoading } = useResolverStatus(name, {
    isWrapped: true,
    profile,
    skipCompare: true,
  })
  const canSetPrimaryName = !!resolverStatus?.isAuthorized

  const { data: { name: primaryName } = {}, isLoading: primaryLoading } = usePrimary(address || '')

  const hasGlobalError = useHasGlobalError()

  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
  const showProfileEditorInput = prepareDataInput('ProfileEditor')
  const showDeleteEmancipatedSubnameWarningInput = prepareDataInput(
    'DeleteEmancipatedSubnameWarning',
  )

  const isLoading = primaryLoading || isResolverStatusLoading

  const profileActions = useMemo(() => {
    const actions: Action[] = []
    if (!address || isLoading) return actions

    if ((selfAbilities.canEdit || profile?.address === address) && primaryName !== name) {
      const setAsPrimaryTransactions: GenericTransaction[] = [
        makeTransactionItem('setPrimaryName', {
          name,
          address: address!,
        }),
      ]
      if (profile?.address !== address && canSetPrimaryName) {
        setAsPrimaryTransactions.unshift(
          makeTransactionItem('updateEthAddress', {
            address: address!,
            name,
          }),
        )
      }
      if (profile?.address !== address && !canSetPrimaryName) {
        setAsPrimaryTransactions.unshift(
          makeTransactionItem('migrateProfileWithEthAddress', {
            name,
            ethAddress: address!,
            resolverAddress: profile?.resolverAddress,
          }),
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: latestResolverAddress,
          }),
        )
      }
      const transactionFlowItem: TransactionFlowItem = {
        transactions: setAsPrimaryTransactions,
        ...(setAsPrimaryTransactions.length > 1
          ? {
              resumable: true,
              intro: {
                title: ['tabs.profile.actions.setAsPrimaryName.title', { ns: 'profile' }],
                content: makeIntroItem('ChangePrimaryName', undefined),
              },
            }
          : {}),
      }
      const key = `setPrimaryName-${name}-${address}`
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        onClick: !checkIsDecrypted(name)
          ? () => showUnknownLabelsInput(key, { name, key, transactionFlowItem })
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
      const action = subnameAbilities.isPCCBurned
        ? {
            label: t('tabs.profile.actions.deleteSubname.label'),
            onClick: () => {
              showDeleteEmancipatedSubnameWarningInput(
                `delete-emancipated-subname-warning-${name}`,
                { name },
              )
            },
            tooltipContent: hasGlobalError
              ? t('errors.networkError.blurb', { ns: 'common' })
              : undefined,
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
            tooltipContent: hasGlobalError
              ? t('errors.networkError.blurb', { ns: 'common' })
              : undefined,
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
    profile?.address,
    name,
    primaryName,
    profile?.resolverAddress,
    selfAbilities.canEdit,
    subnameAbilities.canDelete,
    subnameAbilities.canDeleteContract,
    subnameAbilities.canDeleteError,
    subnameAbilities.canDeleteMethod,
    subnameAbilities.isPCCBurned,
    subnameAbilities.canReclaim,
    isWrapped,
    latestResolverAddress,
    canSetPrimaryName,
    t,
    showUnknownLabelsInput,
    createTransactionFlow,
    showProfileEditorInput,
    showDeleteEmancipatedSubnameWarningInput,
    isLoading,
    hasGlobalError,
  ])

  return {
    profileActions,
    loading: isLoading,
  }
}
