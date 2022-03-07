import { gql, useQuery } from '@apollo/client'
import getShouldDelegate from '@app/api/delegate'
import { useEffect } from 'react'
import getClient from '../apollo/apolloClient'
import {
  delegatesReactive,
  reverseRecordReactive,
} from '../apollo/reactiveVars'
import { getReverseRecord } from '../apollo/sideEffects'
import { usePrevious } from '../utils/utils'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    accounts
    networkId
    isENSReady
  }
`

export default () => {
  const {
    data: { accounts, networkId, isENSReady },
  } = useQuery(REACT_VAR_LISTENERS)

  const previousNetworkId = usePrevious(networkId)

  useEffect(() => {
    const run = async () => {
      reverseRecordReactive(await getReverseRecord(accounts?.[0]))
      delegatesReactive(await getShouldDelegate(accounts?.[0]))
    }
    if (isENSReady) {
      run()
    }
  }, [accounts, isENSReady])

  useEffect(() => {
    if (previousNetworkId !== networkId && previousNetworkId !== undefined) {
      const client = getClient()

      client
        .refetchQueries({
          include: ['getRegistrations', 'getRegistrationsById', 'singleName'],
          onQueryUpdated() {
            return true
          },
        })
        .catch((e) => console.error('refetch error: ', e))
    }
  }, [networkId])
}
