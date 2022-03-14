import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { lazy } from 'apollo-link-lazy'
import typePolicies from './typePolicies'

let client: ApolloClient<NormalizedCacheObject>

const cache = new InMemoryCache({ typePolicies })

export function setupClient() {
  const option = {
    cache,
    // eslint-disable-next-line import/no-cycle
    link: lazy(() => import('./link')),
    connectToDevTools: true,
  }

  client = new ApolloClient(option)
  console.log(client)
}

export default function getClient() {
  return client
}
