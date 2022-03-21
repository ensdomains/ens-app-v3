import { NextPage } from 'next'
import { Basic } from '@app/layouts/Basic'
import React from 'react'
import { gql, useQuery } from '@apollo/client'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    globalError
    networkId
    network
    isAppReady
  }
`

const NetworkPage: NextPage = () => {
  const {
    data: { globalError, isAppReady },
  } = useQuery(REACT_VAR_LISTENERS)

  const isLoading = !isAppReady && !globalError.network
  const isAcceptedNetwork = !globalError.network

  return (
    <Basic>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {isAcceptedNetwork ? (
            <>
              <div>Your network is good.</div>
            </>
          ) : (
            <>
              <div>
                We are currently only using Ropstin network. Please change your
                network
              </div>
            </>
          )}
        </>
      )}
    </Basic>
  )
}

export default NetworkPage
