import styled, { css } from 'styled-components'

import useRoles from '@app/hooks/ownership/useRoles/useRoles'
import type { useNameDetails } from '@app/hooks/useNameDetails'

import { ContractSection } from './sections/ContractSection/ContractSection'
import { ExpirySection } from './sections/ExpirySection/ExpirySection'
import { RolesSection } from './sections/RolesSection/RolesSection'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const OwnershipTab = ({ name, details }: Props) => {
  const roles = useRoles(name, { grouped: true })

  const isLoading = roles.isLoading || details.isLoading
  if (isLoading) return null
  return (
    <Container>
      <RolesSection name={name} roles={roles.data!} details={details} />
      <ExpirySection name={name} details={details} />
      <ContractSection details={details} />
    </Container>
  )
}
