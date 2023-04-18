import { ComponentProps, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Avatar, Space, mq } from '@ensdomains/thorin'

import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'
import { QuerySpace } from '@app/types'

const Wrapper = styled.div<{ $size?: QuerySpace }>(
  ({ theme, $size }) => css`
    ${typeof $size === 'object' &&
    css`
      width: ${theme.space[$size.min]};
      height: ${theme.space[$size.min]};
    `}
    ${typeof $size !== 'object'
      ? css`
          width: ${$size ? theme.space[$size] : theme.space.full};
          height: ${$size ? theme.space[$size] : theme.space.full};
        `
      : Object.entries($size)
          .filter(([key]) => key !== 'min')
          .map(([key, value]) =>
            mq[key as keyof typeof mq].min(css`
              width: ${theme.space[value as Space]};
              height: ${theme.space[value as Space]};
            `),
          )}

    img {
      display: block;
    }
  `,
)

type BaseProps = {
  network: number
  size?: QuerySpace
  noCache?: boolean
}

type Name = {
  name?: string
}

type Address = {
  address?: string
}

export const NameAvatar = ({
  src: _,
  name,
  network,
  size,
  noCache = false,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Required<Name>) => {
  const { avatar } = useAvatar(name, network, noCache)
  const zorb = useZorb(name, 'name')

  const [src, setSrc] = useState<string | undefined>(undefined)
  useEffect(() => {
    setSrc(avatar || zorb)
  }, [avatar, zorb])

  return (
    <Wrapper $size={size}>
      <Avatar {...props} src={src} />
    </Wrapper>
  )
}

export const AvatarWithZorb = ({
  src,
  name,
  address,
  network,
  size,
  noCache = false,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Address & Name) => {
  const { avatar } = useAvatar(name, network, noCache)
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
