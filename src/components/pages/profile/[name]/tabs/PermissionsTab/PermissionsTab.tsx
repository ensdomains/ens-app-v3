import styled, { css } from 'styled-components'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'

import { NameChangePermissions } from './NameChangePermissions'
import { OwnershipPermissions } from './OwnershipPermissions'

type Props = {
  name?: string
}

const Container = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    gap: ${theme.space['4']};
  `,
)

export const PermissionsTab = ({ name }: Props) => {
  const showOwnershipSection = true
  const showPermissions = true
  return (
    <Container>
      {showOwnershipSection && <OwnershipPermissions isCachedData={false} name={name} />}
      {showPermissions && <NameChangePermissions isCachedData={false} />}
    </Container>
  )
}
