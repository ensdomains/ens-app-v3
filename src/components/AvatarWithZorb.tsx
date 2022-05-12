import { Avatar } from '@ensdomains/thorin'
import { zorbImageDataURI } from '@zoralabs/zorb'
import { ComponentProps, useMemo } from 'react'

export const AvatarWithZorb = ({
  src,
  address,
  ...props
}: ComponentProps<typeof Avatar> & { address: string }) => {
  const zorbImg = useMemo(() => zorbImageDataURI(address), [address])
  return <Avatar {...props} src={src || zorbImg} />
}
