import { useMemo } from 'react'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { usePublicClient } from '@app/hooks/usePublicClient'

export const useSubgraphClient = () => {
  const publicClient = usePublicClient()
  return useMemo(() => createSubgraphClient({ client: publicClient }), [publicClient.chain.id])
}
