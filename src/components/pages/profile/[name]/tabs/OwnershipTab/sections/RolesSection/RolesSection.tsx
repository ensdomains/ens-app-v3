import styled, { css } from 'styled-components'

import { Button, Card } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { PseudoActionButton } from '@app/components/@atoms/PseudoActionButton/PseudoActionButton'
import type { GroupedRoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import type { useNameDetails } from '@app/hooks/useNameDetails'

import { Header } from './components/Header'
import { RoleRow } from './components/RoleRow'
import { useRoleActions } from './hooks/useRoleActions'

const Footer = styled.div(
  ({ theme }) =>
    css`
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      gap: ${theme.space[2]};
      min-height: ${theme.space[12]};
    `,
)

const StyledCard = styled(Card)(cacheableComponentStyles, () => css``)

type Props = {
  name: string
  roles: GroupedRoleRecord[]
  details: ReturnType<typeof useNameDetails>
}

export const RolesSection = ({ name, roles, details }: Props) => {
  const actions = useRoleActions({ name, details, roles })

  const isCached = details.basicIsCachedData
  return (
    <StyledCard $isCached={isCached}>
      <Header count={roles?.filter(({ address }) => !!address).length || 0} />
      <Card.Divider />
      {roles?.map((role) => (
        <RoleRow key={role.address} {...role} actions={actions.data} details={details} />
      ))}
      <Footer>
        {actions.data?.map(({ label, type, primary, icon, disabled = false, onClick }) => {
          if (type === 'refresh-dns')
            return (
              <div key={type}>
                <PseudoActionButton
                  data-testid={`role-action-${type}`}
                  colorStyle={primary ? 'accentPrimary' : 'accentSecondary'}
                  prefix={icon}
                  disabled={disabled}
                  onClick={onClick}
                >
                  {label}
                </PseudoActionButton>
              </div>
            )
          return (
            <div key={type}>
              <Button
                data-testid={`role-action-${type}`}
                colorStyle={primary ? 'accentPrimary' : 'accentSecondary'}
                prefix={icon}
                disabled={disabled}
                onClick={onClick}
              >
                {label}
              </Button>
            </div>
          )
        })}
      </Footer>
    </StyledCard>
  )
}
