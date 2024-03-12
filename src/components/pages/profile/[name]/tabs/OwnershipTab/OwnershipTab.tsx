import { Suspense } from 'react'
import styled, { css } from 'styled-components'

import { Banner } from '@ensdomains/thorin'

import { useNameType } from '@app/hooks/nameType/useNameType'
import useRoles from '@app/hooks/ownership/useRoles/useRoles'
import type { useNameDetails } from '@app/hooks/useNameDetails'

import { useOwnershipWarning } from './hooks/useOwnershipWarning'
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
  const nameType = useNameType(name)
  const warning = useOwnershipWarning({ name, details, nameType })
  const isLoading = roles.isLoading || details.isLoading
  if (isLoading) return null
  return (
    <Suspense>
      <Container>
        {warning.data && <Banner alert="warning">{warning.data}</Banner>}
        <RolesSection name={name} roles={roles.data!} details={details} />
        <ExpirySection name={name} details={details} />
        <ContractSection details={details} />
      </Container>
    </Suspense>
  )
}
