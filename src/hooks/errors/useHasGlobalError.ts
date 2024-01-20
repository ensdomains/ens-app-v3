import { useMemo, useState } from 'react'

import { useHasSubgraphSyncErrors } from '@app/utils/useHasSubgraphSyncErrors'

export const useHasGlobalError = (includeLatency = false) => {
  const { error, slow } = useHasSubgraphSyncErrors()
  const [ensjsDebug] = useState(() =>
    typeof localStorage === 'undefined' ? '' : localStorage.getItem('subgraph-debug') || '',
  )

  return useMemo(() => {
    if (includeLatency || ensjsDebug === 'ENSJSSubgraphLatency') {
      return Boolean(error || slow)
    }

    return (
      Boolean(error) || ensjsDebug === 'ENSJSUnknownError' || ensjsDebug === 'ENSJSSubgraphError'
    )
  }, [includeLatency, ensjsDebug, error, slow])
}
