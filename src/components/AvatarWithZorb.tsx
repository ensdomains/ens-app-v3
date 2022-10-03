import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Avatar, Space } from '@ensdomains/thorin'

import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'

const Wrapper = styled.div<{ $size?: Space }>(
  ({ theme, $size }) => css`
    width: ${$size ? theme.space[$size] : theme.space.full};
    height: ${$size ? theme.space[$size] : theme.space.full};

    img {
      display: block;
    }
  `,
)

type BaseProps = {
  network: number
  size?: Space
}

type Name = {
  name?: string
}

type Address = {
  address?: string
}

export const NameAvatar = ({
  src,
  name,
  network,
  size,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Required<Name>) => {
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(name, 'name')
  return (
    <Wrapper $size={size}>
      <Avatar {...props} src={avatar || zorb} />
    </Wrapper>
  )
}

export const AvatarWithZorb = ({
  src,
  name,
  address,
  network,
  size,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Address & Name) => {
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(address || name || '', address ? 'address' : 'name')
  return (
    <Wrapper $size={size}>
      <Avatar {...props} src={avatar || zorb} />
    </Wrapper>
  )
}

export const AddressAvatar = ({
  src,
  address,
  size,
  ...props
}: ComponentProps<typeof Avatar> & Required<Address> & { size?: Space }) => {
  const zorb = useZorb(address, 'address')
  return (
    <Wrapper $size={size}>
      <Avatar {...props} src={zorb} />
    </Wrapper>
  )
}
