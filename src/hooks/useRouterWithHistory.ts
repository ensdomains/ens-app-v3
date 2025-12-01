import { useRouter } from 'next/router'

import { getDestination } from '@app/routes'
import { createUrlObject } from '@app/utils/urlObject'

export const createDecorativeUrlObject = (urlObject?: ReturnType<typeof getDestination>) => {
  if (!urlObject || typeof urlObject === 'string') return undefined
  const { query = {}, ...rest } = urlObject
  const { from, ...cleanQuery } = query
  return { ...rest, query: cleanQuery }
}

export const useRouterWithHistory = () => {
  const router = useRouter()
  const referrer = router.query.referrer as string | undefined
  console.log('[useRouterWithHistory] Full router.query:', JSON.stringify(router.query, null, 2))
  console.log('[useRouterWithHistory] referrer value:', referrer)

  const _replace = router?.replace

  const replace = (
    pathname: string,
    options?: {
      shallow?: boolean
      scroll?: boolean
      maintainHistory?: boolean
    },
  ) => {
    if (typeof window === 'undefined') return
    const { maintainHistory, ...opts } = options || {}

    const urlObject = createUrlObject(pathname, {
      from: maintainHistory ? (router.query.from as string | undefined) : undefined,
      referrer,
    })

    const destination = getDestination(urlObject)
    router.replace(destination, createDecorativeUrlObject(destination), opts)
  }

  const push = (pathname: string, query?: Record<string, any>, shallow?: boolean) => {
    const urlObject = createUrlObject(pathname, { ...query, referrer })
    const destination = getDestination(urlObject)
    router.push(destination, undefined, { shallow })
  }

  const pushWithHistory = (pathname: string, query?: Record<string, any>) => {
    const urlObject = createUrlObject(pathname, {
      ...query,
      from: router.asPath,
      referrer,
    })
    const destination = getDestination(urlObject)
    router.push(destination, createDecorativeUrlObject(destination))
  }

  return { ...router, push, pushWithHistory, replace, _replace }
}
