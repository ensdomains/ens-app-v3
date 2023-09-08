import styled, { css } from 'styled-components'

import { type Role, RoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import { SearchViewResult } from '@app/transaction-flow/input/SendName/views/SearchView/components/SearchViewResult'

import type { useSimpleSearch } from '../../../hooks/useSimpleSearch'

const Container = styled.div(
  () => css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  role: Role
  roles: RoleRecord[]
  results: ReturnType<typeof useSimpleSearch>['data']
  onSelect: (role: { role: Role; address: string }) => void
}

export const EditRoleResultsView = ({ role, roles, onSelect, results = [] }: Props) => {
  return (
    <Container>
      {results.map(({ name, address }) => {
        return (
          <SearchViewResult
            key={address}
            name={name}
            address={address}
            roles={roles}
            role={role}
            onClick={() => {
              onSelect({ role, address })
            }}
          />
        )
      })}
    </Container>
  )
}
