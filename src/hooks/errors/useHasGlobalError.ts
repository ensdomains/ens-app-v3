import { useMemo } from 'react'

import { useGlobalErrorState } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

export const useHasGlobalError = (includeLatency = false) => {
  const globalState = useGlobalErrorState()

  return useMemo(() => {
    const { errors, activeHashes, meta } = globalState
    if (meta.hasSubgraphError) return true
    return (
      activeHashes.filter((hash) => {
        if (includeLatency) return !!errors[hash]
        return !!errors[hash] && errors[hash].type !== 'ENSJSNetworkLatencyError'
      }).length > 0
    )
  }, [globalState, includeLatency])
}
