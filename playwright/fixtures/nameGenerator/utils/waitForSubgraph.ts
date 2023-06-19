/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

/* eslint-disable no-promise-executor-return */
import { GraphQLClient, gql } from 'graphql-request'
import { Provider } from 'playwright/fixtures/provider'

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

export const waitForSubgraph = (provider: Provider) => async () => {
  const blockNumber = await provider.getBlockNumber()

  let wait = true
  let count = 0
  while (wait && count < 4) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const client = new GraphQLClient('http://localhost:8000/subgraphs/name/graphprotocol/ens')
    const res = await client.request(query)
    wait = blockNumber > res._meta.block.number
    count += 1
  }
}
