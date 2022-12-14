import Link, { LinkProps } from 'next/link'
import { PropsWithChildren, useMemo } from 'react'
import { Url } from 'url'

import { getDestination } from '@app/routes'

// from: https://github.com/Velenir/nextjs-ipfs-example

const BaseLink = ({ href, as, ...rest }: PropsWithChildren<LinkProps>) => {
  const resolvedHref = useMemo(
    () => (typeof href === 'string' ? getDestination(href) : href),
    [href],
  )

  const newAs = useMemo(() => {
    let baseURI = (as || resolvedHref) as Partial<Url>
    if (typeof baseURI === 'string') {
      baseURI = {
        href: baseURI,
      }
    } else if ('pathname' in baseURI && !('href' in baseURI)) {
      baseURI.href = baseURI.pathname!
    }

    // make absolute url relative
    // when displayed in url bar
    if (baseURI.href?.startsWith('/')) {
      //  for static html compilation
      baseURI.href = `.${baseURI.href}`
      // <IPFSLink href="/about"> => <a class="jsx-2055897931" href="./about">About</a>

      // on the client
      //   document is unavailable when compiling on the server
      if (typeof document !== 'undefined') {
        baseURI.href = new URL(baseURI.href, document.baseURI).href
        // => <a href="https://gateway.ipfs.io/ipfs/Qm<hash>/about">About</a>
      }
    }
    return baseURI
  }, [as, resolvedHref])

  return <Link {...rest} href={resolvedHref} as={newAs} />
}

export default BaseLink
