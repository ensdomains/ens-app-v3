import { ComponentProps, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useEnsAvatar } from 'wagmi'

import { Avatar, mq, Space } from '@ensdomains/thorin'

import { useZorb } from '@app/hooks/useZorb'
import { QuerySpace } from '@app/types'

const Wrapper = styled.div<{ $size?: QuerySpace }>(
  ({ theme, $size }) => css`
    ${typeof $size === 'object' &&
    css`
      width: ${theme.space[$size.min]};
      height: ${theme.space[$size.min]};
      flex: 0 0 ${theme.space[$size.min]};
    `}
    ${typeof $size !== 'object'
      ? css`
          width: ${$size ? theme.space[$size] : theme.space.full};
          height: ${$size ? theme.space[$size] : theme.space.full};
          flex: 0 0 ${$size ? theme.space[$size] : theme.space.full};
        `
      : Object.entries($size)
          .filter(([key]) => key !== 'min')
          .map(([key, value]) =>
            mq[key as keyof typeof mq].min(css`
              width: ${theme.space[value as Space]};
              height: ${theme.space[value as Space]};
              flex: 0 0 ${theme.space[value as Space]};
            `),
          )}

    img {
      display: block;
    }
  `,
)

type BaseProps = {
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
  size,
  noCache = false,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Required<Name>) => {
  const { data: avatar } = useEnsAvatar({ name, gcTime: noCache ? 0 : undefined })
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
  size,
  noCache = false,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Address & Name) => {
  const { data: avatar } = useEnsAvatar({ name, gcTime: noCache ? 0 : undefined })
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
