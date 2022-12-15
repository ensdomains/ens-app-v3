import Link, { LinkProps } from 'next/link'
import { PropsWithChildren, useMemo } from 'react'

import { getDestination } from '@app/routes'

// from: https://github.com/Velenir/nextjs-ipfs-example

const BaseLink = ({ href, ...rest }: PropsWithChildren<LinkProps>) => {
  const newHref = useMemo(() => getDestination(href), [href])

  return <Link {...rest} href={newHref} />
}

export default BaseLink
