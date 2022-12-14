import { useRouter } from 'next/router'

import { getDestination } from '@app/routes'

export const useRouterWithHistory = () => {
  const router = useRouter()

  const push = (path: string, query?: Record<string, any>) => {
    const { pathname, query: destinationQuery } = getDestination(path)
    return router.push({
      pathname,
      query: {
        ...destinationQuery,
        ...query,
        from: router.asPath,
      },
    })
  }

  return { ...router, pushWithHistory: push }
}
