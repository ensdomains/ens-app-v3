import { ComponentProps, useEffect, useState } from 'react'
import { useEnsAvatar } from 'wagmi'

import { Avatar, BoxProps } from '@ensdomains/thorin'

import { useZorb } from '@app/hooks/useZorb'

type BaseProps = {
  size?: BoxProps['wh']
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
  label,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Required<Name>) => {
  const { data: avatar } = useEnsAvatar({ name, cacheTime: noCache ? 0 : undefined })
  const zorb = useZorb(name, 'name')

  const [src, setSrc] = useState<string | undefined>(undefined)
  useEffect(() => {
    setSrc(avatar || zorb)
  }, [avatar, zorb])

  return <Avatar {...props} src={src} size={size} label={label} />
}

export const AvatarWithZorb = ({
  src,
  name,
  address,
  size,
  noCache = false,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Address & Name) => {
  const { data: avatar } = useEnsAvatar({ name, cacheTime: noCache ? 0 : undefined })
  const zorb = useZorb(address || name || '', address ? 'address' : 'name')
  return <Avatar {...props} src={avatar || zorb} size={size} />
}

export const AddressAvatar = ({
  src,
  address,
  size,
  ...props
}: ComponentProps<typeof Avatar> & BaseProps & Required<Address>) => {
  const zorb = useZorb(address, 'address')
  return <Avatar {...props} src={zorb} size={size} />
}
