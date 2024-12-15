import { UrlObject } from 'url'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo } from 'react'

import { getDestination } from '@app/routes'

// from: https://github.com/Velenir/nextjs-ipfs-example

const BaseLink = ({ href, ...rest }: PropsWithChildren<LinkProps>) => {
  const newHref = useMemo(() => getDestination(href), [href])

  return <Link {...rest} legacyBehavior href={newHref} />
}

export const BaseLinkWithHistory = ({
  href,
  ...rest
}: Omit<PropsWithChildren<LinkProps>, 'href'> & { href: string }) => {
  const router = useRouter()
  const newHref = useMemo(() => {
    const initialQuery = {
      from: router.asPath,
    }
    return getDestination({ pathname: href, query: initialQuery }) as UrlObject
  }, [href, router.asPath])

  return <Link {...rest} legacyBehavior href={newHref} as={newHref.pathname!} />
}

export default BaseLink
