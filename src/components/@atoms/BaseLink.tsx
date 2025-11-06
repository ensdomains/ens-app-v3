import { UrlObject } from 'url'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo } from 'react'

import { getDestination } from '@app/routes'
import { createUrlObject } from '@app/utils/urlObject'

// from: https://github.com/Velenir/nextjs-ipfs-example

const BaseLink = ({ href, ...rest }: PropsWithChildren<LinkProps>) => {
  const router = useRouter()
  const referrer = router.query.referrer as string | undefined

  const newHref = useMemo(() => {
    const urlObject = createUrlObject(href, referrer ? { referrer } : undefined)
    return getDestination(urlObject)
  }, [href, referrer])

  return <Link {...rest} legacyBehavior href={newHref} />
}

export const BaseLinkWithHistory = ({
  href,
  ...rest
}: Omit<PropsWithChildren<LinkProps>, 'href'> & { href: string }) => {
  const router = useRouter()

  const newHref = useMemo(() => {
    const urlObject = createUrlObject(href, {
      from: router.asPath,
      referrer: router.query.referrer as string | undefined,
    })
    return getDestination(urlObject) as UrlObject
  }, [href, router.asPath, router.query.referrer])

  return <Link {...rest} legacyBehavior href={newHref} as={newHref.pathname!} />
}

export default BaseLink
