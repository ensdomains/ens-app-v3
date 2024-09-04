import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { AnyRoute, routes } from '@app/routes'

export const useActiveRoute = () => {
  const router = useRouter()
  const from = router.query.from as string
  const path = router.asPath
  const pathWithoutQuery = path.split('?')[0]
  const activeTab: AnyRoute = useMemo(
    () =>
      routes.find(({ href, name }) => href === pathWithoutQuery || from === name)?.name ||
      'unknown',
    [pathWithoutQuery, from],
  )

  return activeTab
}
