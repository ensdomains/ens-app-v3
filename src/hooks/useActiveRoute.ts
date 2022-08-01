import { AnyRoute, routes } from '@app/routes'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const useActiveRoute = () => {
  const router = useRouter()
  const from = router.query.from as string
  const path = router.asPath
  const activeTab: AnyRoute = useMemo(
    () => routes.find(({ href, name }) => href === path || from === name)?.name || 'unknown',
    [path, from],
  )

  return activeTab
}
