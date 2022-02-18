import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Operation,
  split,
} from "@apollo/client";
import { Observable } from "zen-observable-ts";
import resolvers from "../api/resolvers";
import { networkIdReactive } from "./reactiveVars";
import typePolicies from "./typePolicies";

let client: ApolloClient<NormalizedCacheObject>;

const cache = new InMemoryCache({ typePolicies });

const endpoints: Record<number, string> = {
  1: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  3: "https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten",
  4: "https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby",
  5: "https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli",
};

function getGraphQLAPI(): string {
  const network = networkIdReactive() as number;

  if (network > 100 && process.env.REACT_APP_GRAPH_NODE_URI) {
    return process.env.REACT_APP_GRAPH_NODE_URI;
  }

  if (endpoints[network]) {
    return endpoints[network];
  }

  return endpoints[1];
}

function fromPromise(promise: Promise<any>, operation: Operation) {
  return new Observable((observer) => {
    promise
      .then((value) => {
        operation.setContext({ response: value });
        observer.next({
          data: { [operation.operationName]: value },
          errors: [],
        });
        observer.complete();
      })
      .catch((e) => {
        console.error("fromPromise error: ", e);
        observer.error.bind(observer);
      });
  });
}

export function setupClient() {
  const httpLink = new HttpLink({
    uri: () => getGraphQLAPI(),
  });

  const web3Link = new ApolloLink(
    (operation: Operation): Observable<any> | null => {
      const { variables, operationName } = operation;

      if (resolvers.Query[operationName]) {
        return fromPromise(
          resolvers.Query[operationName]?.apply(null, [
            null,
            variables,
            client,
          ]),
          operation
        );
      }
      return null;
    }
  );

  const splitLink = split(
    ({ operationName }) => {
      return (
        resolvers.Query[operationName] || resolvers.Mutation[operationName]
      );
    },
    web3Link,
    httpLink
  );

  const option = {
    cache,
    link: splitLink,
    connectToDevTools: true,
  };

  client = new ApolloClient(option);
}

export default function getClient() {
  return client;
}
