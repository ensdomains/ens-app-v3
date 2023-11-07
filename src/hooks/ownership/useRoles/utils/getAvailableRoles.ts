import { match } from 'ts-pattern'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { GroupedRoleRecord, RoleRecord } from '@app/hooks/ownership/useRoles/useRoles'

export const getAvailableRoles = ({
  roles,
  abilities,
}: {
  roles: RoleRecord[] | GroupedRoleRecord[]
  abilities: ReturnType<typeof useAbilities>['data']
}) => {
  const listRoles = roles
    .map(({ role: _role, roles: _roles = [], address }) => [
      ...(_role ? [{ role: _role, address }] : []),
      ..._roles.map((role) => ({ role, address })),
    ])
    .flat()
    .filter((r) => !!r) as RoleRecord[]
  return listRoles?.filter(({ role }) =>
    match(role)
      .with('owner', () => abilities?.canSendOwner)
      .with('manager', () => abilities?.canSendManager)
      .with('eth-record', () => abilities?.canEditRecords)
      .with('dns-owner', () => false)
      .with('parent-owner', () => false)
      .exhaustive(),
  )
}
