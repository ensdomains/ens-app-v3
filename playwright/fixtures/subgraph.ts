/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

/* eslint-disable no-promise-executor-return */
import { gql, GraphQLClient } from 'graphql-request'
import { getBlockNumber } from 'viem/actions'

import { publicClient } from './contracts/utils/addTestContracts'

export type Subgraph = ReturnType<typeof createSubgraph>

const query = gql`
  query getMeta {
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`

export const waitForSubgraph = () => async () => {
  const blockNumber = await getBlockNumber(publicClient)

  let wait = true
  let count = 0
  do {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const client = new GraphQLClient('http://localhost:8000/subgraphs/name/graphprotocol/ens')
    const res = await client.request(query)
    wait = blockNumber > res._meta.block.number
    count += 1
    console.log(`subgraph: ${res._meta.block.number} -> ${blockNumber} ${!wait ? '[IN SYNC]' : ''}`)
  } while (wait && count < 10)
}

export const createSubgraph = () => ({
  sync: waitForSubgraph(),
})
