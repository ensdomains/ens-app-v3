import { useQueryClient } from 'wagmi'

import {
  AeroplaneSVG,
  Card,
  CounterClockwiseArrowSVG,
  HorizontalOutwardArrowsSVG,
  PersonSVG,
} from '@ensdomains/thorin'

import useRoles from '@app/components/pages/profile/[name]/tabs/OwnershipTab/sections/RolesSection/hooks/useRoles'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RoleRow } from './components/RoleRow'

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const RolesSection = ({ name, details }: Props) => {
  const { prepareDataInput } = useTransactionFlow()
  const queryClient = useQueryClient()
  const showSendNameInput = prepareDataInput('SendName')
  const showEditRolesInput = prepareDataInput('EditRoles')
  const showSyncManagerInput = prepareDataInput('SyncManager')

  const roles = useRoles({ name, details }, { grouped: true })

  const buttons = [
    {
      prefix: <AeroplaneSVG />,
      label: 'Send',
      onClick: () => showSendNameInput(`send-name`, { name }),
    },
    {
      prefix: <CounterClockwiseArrowSVG />,
      label: 'Refresh DNS',
      onClick: () => queryClient.resetQueries({ exact: true, queryKey: ['getDNSOwner', name] }),
    },
    {
      prefix: <HorizontalOutwardArrowsSVG />,
      label: 'Sync manager',
      onClick: () =>
        showSyncManagerInput(`sync-manager`, {
          name,
          manager: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        }),
    },
    {
      prefix: <AeroplaneSVG />,
      label: 'Send',
      onClick: () => showSendNameInput(`send-name`, { name }),
    },
    {
      prefix: <PersonSVG />,
      label: 'Edit roles',
      primary: true,
      onClick: () => showEditRolesInput(`edit-roles`, { name }),
    },
  ]

  return (
    <Card>
      <Header count={roles.data?.filter(({ address }) => !!address).length || 0} />
      <Card.Divider />
      {roles.data?.map((role) => (
        <RoleRow key={role.address} {...role} showEditRolesInput={showEditRolesInput} />
      ))}
      <Footer buttons={buttons} />
    </Card>
  )
}
