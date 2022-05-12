import { zorbImageDataURI } from '@app/utils/gradient'
import { Avatar } from '@ensdomains/thorin'
import { ComponentProps, useMemo } from 'react'

export const AvatarWithZorb = ({
  src,
  address,
  ...props
}: ComponentProps<typeof Avatar> & { address: string }) => {
  const zorbImg = useMemo(() => zorbImageDataURI(address, 'address'), [address])
  return <Avatar {...props} src={src || zorbImg} />
}
