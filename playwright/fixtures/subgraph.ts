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
  const anvilBlockNumbers: number[] = []
  do {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const client = new GraphQLClient('http://localhost:42069/subgraph')
    const res = await client.request<{_meta: {block: {number: number}}}>(query)

    anvilBlockNumbers.push(res._meta.block.number)
    if (anvilBlockNumbers.length > 10) anvilBlockNumbers.shift()

    const finished = res._meta.block.number >= blockNumber
    console.log(`subgraph: ${res._meta.block.number} -> ${blockNumber} ${finished ? '[IN SYNC]' : ''}`)

    if (anvilBlockNumbers.length >= 10 && anvilBlockNumbers.every((blockNumb) => blockNumb === anvilBlockNumbers[0])) throw new Error('Subgraph not in sync')
  } while (anvilBlockNumbers[anvilBlockNumbers.length - 1] < blockNumber)
}

export const createSubgraph = () => ({
  sync: waitForSubgraph(),
})
