import { useRouter } from 'next/router'

import { getDestination } from '@app/routes'

export const useRouterWithHistory = () => {
  const router = useRouter()

  const push = (pathname: string, query?: Record<string, any>) => {
    const destination = getDestination({ pathname, query })
    router.push(destination)
  }

  const pushWithHistory = (pathname: string, query?: Record<string, any>) => {
    const initialQuery = query || {}
    initialQuery.from = router.asPath
    const destination = getDestination({ pathname, query: initialQuery })
    router.push(destination, typeof destination === 'string' ? undefined : destination.pathname)
  }

  return { ...router, push, pushWithHistory }
}
