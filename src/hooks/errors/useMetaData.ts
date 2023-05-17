import { Provider } from '@wagmi/core'
import { useEffect } from 'react'
import { useProvider } from 'wagmi'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import type { GlobalErrorDispatch, GlobalErrorState } from '@app/utils/GlobalErrorProvider'

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

const debugSubgraphIndexingErrors = () => {
  return (
    (process.env.NEXT_PUBLIC_ENSJS_DEBUG === 'on' || process.env.NODE_ENV === 'development') &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('ensjs-debug') === 'ENSJSSubgraphError' &&
    localStorage.getItem('subgraph-debug') === 'ENSJSSubgraphIndexingError'
  )
}

export const getMetaData = async ({
  gqlInstance,
  provider,
  dispatch,
}: {
  gqlInstance: ReturnedENS['gqlInstance']
  provider: Provider
  dispatch: GlobalErrorDispatch
}) => {
  try {
    const data = await gqlInstance.client.request(query)
    const hasIndexingErrors = data?._meta?.hasIndexingErrors || debugSubgraphIndexingErrors()
    const blockNumber = data?._meta?.block?.number

    if (!hasIndexingErrors || !blockNumber || !provider) return
    dispatch({
      type: 'SET_META',
      payload: {
        hasIndexingErrors: true,
      },
    })
    const block = await provider.getBlock(blockNumber)
    const timestamp = block?.timestamp
    if (!timestamp) return
    dispatch({
      type: 'SET_META',
      payload: {
        timestamp,
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export const useMetaData = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { ready, gqlInstance } = useEns()
  const provider = useProvider()
  const { meta } = state

  useEffect(() => {
    if (ready && meta.hasSubgraphError) {
      getMetaData({ gqlInstance, provider, dispatch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, meta.hasSubgraphError])
}
