import { Provider } from '@wagmi/core'
import { useEffect } from 'react'
import { useMutation, useProvider } from 'wagmi'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
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

const fetchMeta = async (gqlInstance: ReturnedENS['gqlInstance']) => {
  const data = await gqlInstance.client.request(query)
  return {
    hasIndexingErrors: data?._meta.hasIndexingErrors || debugSubgraphIndexingErrors(),
    blockNumber: data?._meta.block?.number,
  }
}

const fetchTimestamp = async ({
  provider,
  blockNumber,
}: {
  provider: Provider
  blockNumber: number
}) => {
  const block = await provider.getBlock(blockNumber)
  return block?.timestamp
}

export const useSubgraphMetaSync = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { ready, gqlInstance } = useEns()
  const provider = useProvider()

  const { meta } = state

  const { mutate: updateTimestamp } = useMutation(fetchTimestamp, {
    onSuccess: (timestamp = 0) => {
      dispatch({
        type: 'SET_META',
        payload: {
          timestamp,
        },
      })
    },
  })

  const { mutate: updateMeta } = useMutation(fetchMeta, {
    onSuccess: ({ hasIndexingErrors, blockNumber }) => {
      dispatch({
        type: 'SET_META',
        payload: {
          hasSubgraphError: hasIndexingErrors ? true : undefined,
          hasIndexingErrors,
        },
      })
      if (hasIndexingErrors && blockNumber && provider) updateTimestamp({ provider, blockNumber })
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

  const shouldFetchMeta = ready && (meta.forceUpdate || meta.hasSubgraphError)
  //
  useEffect(() => {
    if (shouldFetchMeta) {
      updateMeta(gqlInstance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchMeta])
}
