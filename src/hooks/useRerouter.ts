import { useEffect } from 'react'

import { ReplaceOptions, useRouterWithHistory } from './useRouterWithHistory'

export function useRerouter({
  enabled,
  pathname,
  options,
}: {
  enabled: boolean
  pathname: string
  options?: ReplaceOptions
}) {
  const router = useRouterWithHistory()

  useEffect(() => {
    if (enabled && pathname) {
      router.replace(pathname, options)
    }
  }, [enabled, pathname])

  return {}
}
