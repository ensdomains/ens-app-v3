import { ApolloLink, HttpLink, Operation, split } from '@apollo/client'
import resolvers from '@app/api/resolvers'
import { Observable } from 'zen-observable-ts'
import getClient from './apolloClient'
import { networkIdReactive } from './reactiveVars'

function fromPromise(promise: Promise<any>, operation: Operation) {
  return new Observable((observer) => {
    promise
      .then((value) => {
        operation.setContext({ response: value })
        observer.next({
          data: { [operation.operationName]: value },
          errors: [],
        })
        observer.complete()
      })
      .catch((e) => {
        console.error('fromPromise error: ', e)
        observer.error.bind(observer)
      })
  })
}

const endpoints: Record<number, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
}

function getGraphQLAPI(): string {
  const network = networkIdReactive() as number

  if (process.env.NEXT_PUBLIC_GRAPH_URI) {
    return process.env.NEXT_PUBLIC_GRAPH_URI
  }

  if (endpoints[network]) {
    return endpoints[network]
  }

  return endpoints[1]
}

const httpLink = new HttpLink({
  uri: () => getGraphQLAPI(),
})

const web3Link = new ApolloLink(
  (operation: Operation): Observable<any> | null => {
    const { variables, operationName } = operation

    if (resolvers.Query[operationName]) {
      return fromPromise(
        resolvers.Query[operationName]?.apply(null, [
          null,
          variables,
          getClient(),
        ]),
        operation,
      )
    }
    return null
  },
)

const splitLink = split(
  ({ operationName }) => {
    return resolvers.Query[operationName] || resolvers.Mutation[operationName]
  },
  web3Link,
  httpLink,
)

export default splitLink
