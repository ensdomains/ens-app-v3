import { useMemo } from 'react'

import { useHasSubgraphSyncErrors } from '@app/utils/GlobalErrorProvider/useHasSubgraphSyncErrors'

export const useHasGlobalError = (includeLatency = false) => {
  const { error, slow } = useHasSubgraphSyncErrors()

  return useMemo(() => {
    if (includeLatency) {
      return !!error || !!slow
    }

    return !!error
  }, [error, slow, includeLatency])
}
