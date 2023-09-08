import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import {
  AeroplaneSVG,
  CounterClockwiseArrowSVG,
  HorizontalOutwardArrowsSVG,
  PersonSVG,
} from '@ensdomains/thorin'
import { DropdownItemObject } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'
import { ReactNodeNoStrings } from '@ensdomains/thorin/dist/types/types'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import type { GroupedRoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import { getAvailableRoles } from '@app/hooks/ownership/useRoles/utils/getAvailableRoles'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import { useNameType } from '@app/hooks/useNameType'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { checkCanSend } from '@app/transaction-flow/input/SendName/utils/checkCanSend'
import { checkCanSyncManager } from '@app/transaction-flow/input/SyncManager/utils/checkCanSyncManager'

type Action = Omit<DropdownItemObject, 'onClick' | 'icon'> & {
  primary?: boolean
  icon: ReactNodeNoStrings
  type: string
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
  const abilities = useAbilities(name)
  const { prepareDataInput } = useTransactionFlow()

  const showSendNameInput = prepareDataInput('SendName')
  const showSendName2Input = prepareDataInput('SendName2')
  const showEditRolesInput = prepareDataInput('EditRoles')
  const showSyncManagerInput = prepareDataInput('SyncManager')
  const queryClient = useQueryClient()

  const isLoading =
    !account.address || nameType.isLoading || abilities.isLoading || details.isLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    const canSend = checkCanSend({ abilities: abilities.data, nameType: nameType.data })
    const canSendDNS = canSend && nameType.data?.startsWith('dns')
    // const canSendEth = canSend && nameType.data?.startsWith('eth')
    const showSyncManager = checkCanSyncManager({
      address: account.address,
      details,
      nameType: nameType.data,
    })
    const availableRoles = getAvailableRoles({ roles, abilities: abilities.data })
    const canEditRoles = availableRoles.length > 0
    return [
      true
        ? {
            type: 'send-dns',
            icon: <AeroplaneSVG />,
            label: t('action.send'),
            onClick: () => showSendNameInput(`send-name`, { name }),
          }
        : null,
      canSendDNS
        ? {
            type: 'refresh-dns',
            icon: <CounterClockwiseArrowSVG />,
            label: t('dns.refresh'),
            onClick: () =>
              queryClient.resetQueries({ exact: true, queryKey: ['getDNSOwner', name] }),
          }
        : null,
      showSyncManager
        ? {
            type: 'sync-manager',
            icon: <HorizontalOutwardArrowsSVG />,
            label: t('transaction.description.syncManager'),
            onClick: () =>
              showSyncManagerInput(`sync-manager`, {
                name,
              }),
          }
        : null,
      canSend
        ? {
            type: 'send-name',
            icon: <AeroplaneSVG />,
            label: t('action.send'),
            onClick: () => showSendName2Input(`send-name`, { name }),
          }
        : null,
      canEditRoles
        ? {
            type: 'edit-roles',
            icon: <PersonSVG />,
            label: t('action.editRoles'),
            primary: true,
            disabled: availableRoles.length === 0,
            onClick: () => showEditRolesInput(`edit-roles`, { name }),
          }
        : null,
    ].filter((action) => !!action) as Action[]
  }, [
    isLoading,
    name,
    account.address,
    details.ownerData,
    details.dnsOwner,
    abilities.data,
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
