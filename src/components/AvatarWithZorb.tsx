import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'
import { Avatar } from '@ensdomains/thorin'
import { ComponentProps } from 'react'

export const NameAvatar = ({
  src,
  name,
  network,
  ...props
}: ComponentProps<typeof Avatar> & {
  name: string
  network: number
}) => {
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(name, 'name')
  return <Avatar {...props} src={avatar || zorb} />
}

export const AvatarWithZorb = ({
  src,
  name,
  address,
  network,
  ...props
}: ComponentProps<typeof Avatar> & {
  name?: string
  address?: string
  network: number
}) => {
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(address || name || '', address ? 'address' : 'name')
  return <Avatar {...props} src={avatar || zorb} />
}

export const AddressAvatar = ({
  src,
  address,
  ...props
}: ComponentProps<typeof Avatar> & {
  address: string
}) => {
  const zorb = useZorb(address, 'address')
  return <Avatar {...props} src={zorb} />
}
