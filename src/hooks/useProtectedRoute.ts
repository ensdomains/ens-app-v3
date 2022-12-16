import { useEffect } from 'react'

import { useRouterWithHistory } from './useRouterWithHistory'

export const useProtectedRoute = (baseRoute: string, condition: any) => {
  const router = useRouterWithHistory()

  useEffect(() => {
    if (!condition) {
      router.push(baseRoute)
    }
  }, [router, condition, baseRoute])
}
