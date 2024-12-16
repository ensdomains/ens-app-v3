import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AeroplaneSVG,
  AsProp,
  CounterClockwiseArrowSVG,
  HorizontalOutwardArrowsSVG,
  PersonSVG,
} from '@ensdomains/thorin'
import { DropdownItemObject } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useNameType } from '@app/hooks/nameType/useNameType'
import type { GroupedRoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import { getAvailableRoles } from '@app/hooks/ownership/useRoles/utils/getAvailableRoles'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import { checkCanSend } from '@app/transaction-flow/input/SendName/utils/checkCanSend'
import { checkCanSyncManager } from '@app/transaction-flow/input/SyncManager/utils/checkCanSyncManager'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

type Action = Omit<DropdownItemObject, 'onClick' | 'icon'> & {
  primary?: boolean
  icon: AsProp
  type: string
  error?: string
  onClick?: () => void
}

type Props = {
  name: string
  roles: GroupedRoleRecord[]
  details: ReturnType<typeof useNameDetails>
}

export const useRoleActions = ({ name, roles, details }: Props) => {
  const { t } = useTranslation('common')
  const account = useAccountSafely()
  const nameType = useNameType(name)
  const abilities = useAbilities({ name })
  const queryClient = useQueryClient()

  const { usePreparedDataInput } = useTransactionFlow()
  const showSendNameInput = usePreparedDataInput('SendName')
  const showEditRolesInput = usePreparedDataInput('EditRoles')
  const showSyncManagerInput = usePreparedDataInput('SyncManager')

  const isLoading =
    !account.address || nameType.isLoading || abilities.isLoading || details.isLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    const canSend = checkCanSend({ abilities: abilities.data, nameType: nameType.data })
    const canSendError = abilities.data?.canSendError
    const showSend = canSend || !!canSendError
    const showSendDNS = showSend && name && !name.endsWith('.eth')
    const showSendEth = showSend && name && name.endsWith('.eth')
    const canRefreshDNS =
      !!account.address && name && !name.endsWith('.eth') && name.split('.').length === 2
    const showSyncManager = checkCanSyncManager({
      address: account.address,
      nameType: nameType.data,
      registrant: details.ownerData?.registrant,
      owner: details.ownerData?.owner,
      dnsOwner: details.dnsOwner,
    })
    const availableRoles = getAvailableRoles({ roles, abilities: abilities.data })
    const canEditRoles = availableRoles.length > 0
    return [
      showSendDNS
        ? {
            type: 'send-dns',
            icon: AeroplaneSVG,
            label: t('action.send'),
            error: canSendError,
            onClick: () => showSendNameInput(`send-name-${name}`, { name }),
          }
        : null,
      canRefreshDNS
        ? {
            type: 'refresh-dns',
            icon: CounterClockwiseArrowSVG,
            label: t('dns.refresh'),
            onClick: () =>
              queryClient.resetQueries({ exact: true, queryKey: ['getDNSOwner', name] }),
          }
        : null,
      showSyncManager
        ? {
            type: 'sync-manager',
            icon: HorizontalOutwardArrowsSVG,
            label: t('transaction.description.syncManager'),
            onClick: () =>
              showSyncManagerInput(`sync-manager-${name}`, {
                name,
              }),
          }
        : null,
      showSendEth
        ? {
            type: 'send-name',
            icon: AeroplaneSVG,
            label: t('action.send'),
            error: canSendError,
            onClick: () => showSendNameInput(`send-name-${name}`, { name }),
          }
        : null,
      canEditRoles
        ? {
            type: 'edit-roles',
            icon: PersonSVG,
            label: t('action.editRoles'),
            primary: true,
            onClick: () => showEditRolesInput(`edit-roles-${name}`, { name }),
          }
        : null,
    ].filter((action) => !!action) as Action[]
  }, [
    isLoading,
    name,
    nameType.data,
    account.address,
    details.ownerData,
    details.dnsOwner,
    abilities.data,
    roles,
    t,
    queryClient,
    showSendNameInput,
    showEditRolesInput,
    showSyncManagerInput,
  ])

  return {
    data,
    isLoading,
  }
}
