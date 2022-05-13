import { useZorb } from '@app/hooks/useZorb'
import { Avatar } from '@ensdomains/thorin'
import { ComponentProps } from 'react'

export const AvatarWithZorb = ({
  src,
  address,
  ...props
}: ComponentProps<typeof Avatar> & { address: string }) => {
  const zorb = useZorb(address, 'address')
  return <Avatar {...props} src={src || zorb} />
}
