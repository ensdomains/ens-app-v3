import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    networkId
    isENSReady
    globalError
    isAppReady
  }
`

export const useEthereumNetworkStatus = () => {
  const {
    data: { networkId, isENSReady, globalError, isAppReady },
  } = useQuery(REACT_VAR_LISTENERS)

  useEffect(() => {
    console.log(networkId, isENSReady, globalError, isAppReady)
    // console.log('get provider', getProvider)
    // const test = async () => {
    //   if (getProvider) {
    //     const provider = await getProvider()
    //     console.log(provider)
    //   }
    // }
    // test()

    return () => {}
  }, [networkId, isENSReady, globalError, isAppReady])
}
