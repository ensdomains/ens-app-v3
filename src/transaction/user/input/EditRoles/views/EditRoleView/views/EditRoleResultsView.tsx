import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { RoleRecord, type Role } from '@app/hooks/ownership/useRoles/useRoles'
import { SearchViewResult } from '@app/transaction-flow/input/SendName/views/SearchView/components/SearchViewResult'

import type { useSimpleSearch } from '../../../hooks/useSimpleSearch'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    min-height: ${theme.space['40']};
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  role: Role
  roles: RoleRecord[]
  results: ReturnType<typeof useSimpleSearch>['data']
  onSelect: (role: { role: Role; address: Address }) => void
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
            excludeRole={role}
            onClick={() => {
              onSelect({ role, address })
            }}
          />
        )
      })}
    </Container>
  )
}
