import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    globalError
  }
`

export const useAcceptedEthereumNetworksRedirect = () => {
  const router = useRouter()

  const {
    data: { globalError },
  } = useQuery(REACT_VAR_LISTENERS)

  const shouldRedirect: boolean =
    !!globalError.network && router.asPath !== '/network'

  useEffect(() => {
    if (shouldRedirect) router.push('/network').then()
  }, [shouldRedirect, router])
}
