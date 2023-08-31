import { useEffect } from 'react'
import { useMutation } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { usePublicClient } from '@app/hooks/usePublicClient'
import { PublicClientWithChain } from '@app/types'
import type {
  GlobalErrorDispatch,
  GlobalErrorState,
} from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

const query = `
  query getMeta {
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }  
`

export const debugSubgraphIndexingErrors = () => {
  return (
    (process.env.NEXT_PUBLIC_ENSJS_DEBUG === 'on' || process.env.NODE_ENV === 'development') &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('ensjs-debug') === 'ENSJSSubgraphError' &&
    localStorage.getItem('subgraph-debug') === 'ENSJSSubgraphIndexingError'
  )
}

type SubgraphResult = {
  _meta: {
    hasIndexingErrors: boolean
    block?: {
      number: number
    }
  }
}

const getSubgraphMetadata = async (publicClient: PublicClientWithChain) => {
  const subgraphClient = createSubgraphClient({ client: publicClient })
  const data = await subgraphClient.request<SubgraphResult>(query)
  return {
    hasIndexingErrors: data?._meta.hasIndexingErrors || debugSubgraphIndexingErrors(),
    blockNumber: data?._meta.block?.number,
  }
}

const fetchTimestamp = async (publicClient: PublicClientWithChain, blockNumber: number) => {
  const block = await publicClient.getBlock({ blockNumber: BigInt(blockNumber) })
  return block?.timestamp ? Number(block.timestamp) : undefined
}

export const useSubgraphMetaSync = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const publicClient = usePublicClient()

  const { meta } = state

  const { mutate: updateTimestamp } = useMutation({
    mutationFn: (blockNumber: number) => fetchTimestamp(publicClient, blockNumber),
    onSuccess: (timestamp = 0) => {
      dispatch({
        type: 'SET_META',
        payload: {
          timestamp,
        },
      })
    },
  })

  const { mutate: updateSubgraphMetadata } = useMutation({
    mutationFn: () => getSubgraphMetadata(publicClient),
    onSuccess: ({ hasIndexingErrors, blockNumber }) => {
      dispatch({
        type: 'SET_META',
        payload: {
          hasSubgraphError: hasIndexingErrors ? true : undefined,
          hasIndexingErrors,
        },
      })
      if (hasIndexingErrors && blockNumber) updateTimestamp(blockNumber)
    },
    onError: () => {
      dispatch({
        type: 'SET_META',
        payload: {
          hasSubgraphError: true,
        },
      })
    },
  })

  const shouldFetchMeta = meta.forceUpdate || meta.hasSubgraphError
  //
  useEffect(() => {
    if (shouldFetchMeta) {
      updateSubgraphMetadata()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchMeta])
}
