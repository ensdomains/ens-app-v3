import { ButtonHTMLAttributes, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { mq, Tag } from '@ensdomains/thorin2'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'

const LeftContainer = styled.div(() => css``)

const RightContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    gap: ${theme.space[2]};
  `,
)

const Container = styled.button(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space[4]};
    border-bottom: 1px solid ${theme.colors.border};

    :disabled {
      background: ${theme.colors.greySurface};
      ${LeftContainer} {
        opacity: 0.5;
      }
    }
  `,
  mq.sm.min(css`
    padding: ${theme.space[4]} ${theme.space[6]};
  `),
])

type Props = {
  name?: string
  address: Address
  role?: string
  roles: any[]
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'name'>

export const SearchViewResultsRow = ({ address, name, role, roles, ...props }: Props) => {
  const markers = useMemo(() => {
    const userRoles = roles.filter((r) => r.address === address)
    const hasRole = userRoles.some((r) => r.role === role)
    return { userRoles, hasRole }
  }, [roles, role, address])

  return (
    <Container
      data-testid={`search-result-${address}`}
      type="button"
      disabled={markers.hasRole}
      {...props}
    >
      <LeftContainer>
        <AvatarWithIdentifier address={address} name={name} />
      </LeftContainer>
      <RightContainer>
        {markers.userRoles.map((_role) => (
          <Tag>{_role.role}</Tag>
        ))}
      </RightContainer>
    </Container>
  )
}
