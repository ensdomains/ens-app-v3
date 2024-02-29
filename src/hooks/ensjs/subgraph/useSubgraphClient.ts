import { useMemo } from 'react'
import { useClient } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

export const useSubgraphClient = () => {
  const client = useClient()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createSubgraphClient({ client }), [client.chain.id])
}
