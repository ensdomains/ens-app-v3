import styled, { css } from 'styled-components'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'

const Container = styled.div(() => css``)

type Props = {
  name: string
  address: string
  isManager: boolean
  isOwner: boolean
}

export const SearchRow = ({ name, address, isManager, isOwner }: Props) => {
  return (
    <Container>
      <AvatarWithIdentifier address={address} name={name} />
      {name} {address} {isManager} {isOwner}
    </Container>
  )
}
