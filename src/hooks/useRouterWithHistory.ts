import { useRouter } from 'next/router'

import { getDestination } from '@app/routes'

export const useRouterWithHistory = () => {
  const router = useRouter()

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
    const destination =
      maintainHistory && router.query.from
        ? getDestination({ pathname, query: { from: router.query.from } })
        : getDestination(pathname)
    router.replace(
      destination,
      typeof destination === 'string' ? undefined : destination.pathname,
      opts,
    )
  }

  const push = (pathname: string, query?: Record<string, any>, shallow?: boolean) => {
    const destination = getDestination({ pathname, query })
    router.push(destination, undefined, { shallow })
  }

  const pushWithHistory = (pathname: string, query?: Record<string, any>) => {
    const initialQuery = query || {}
    initialQuery.from = router.asPath
    const destination = getDestination({ pathname, query: initialQuery })
    router.push(destination, typeof destination === 'string' ? undefined : destination.pathname)
  }

  return { ...router, push, pushWithHistory, replace, _replace }
}
