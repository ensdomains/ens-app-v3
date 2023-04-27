import { useMemo } from 'react'

import type { ContentWarning } from '@app/layouts/Content'
import { useGlobalState } from '@app/utils/GlobalStateProvider'

export const useContentWarning = (otherErrors: ContentWarning[] = []) => {
  const globalState = useGlobalState()
  const warning = useMemo(() => {
    if (globalState.error)
      return {
        type: 'warning',
        title: globalState.error.title,
        message: globalState.error.message,
      } as ContentWarning
    const otherError = otherErrors[otherErrors.length - 1]
    if (otherError) return otherError

    return undefined
  }, [globalState, otherErrors])

  return warning
}
