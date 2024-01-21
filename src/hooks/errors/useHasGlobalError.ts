import { useHasSubgraphSyncErrors } from '@app/utils/useHasSubgraphSyncErrors'

import { useReadLocalStorage } from '../useLocalStorage'

export const useHasGlobalError = (includeLatency = false) => {
  const { error, slow } = useHasSubgraphSyncErrors()
  const subgraphDebug = useReadLocalStorage<string>('subgraph-debug')

  if (includeLatency || subgraphDebug === 'ENSJSSubgraphLatency') {
    return Boolean(error || slow)
  }

  return (
    Boolean(error) ||
    subgraphDebug === 'ENSJSUnknownError' ||
    subgraphDebug === 'ENSJSSubgraphError'
  )
}
