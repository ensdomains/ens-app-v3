"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const normalise_js_1 = require("../../utils/normalise.js");
const client_js_1 = require("./client.js");
const inheritedResolverQuery = (0, graphql_request_1.gql) `
  query getSubgraphRecords($id: String!) {
    domain(id: $id) {
      name
      isMigrated
      createdAt
      resolver {
        texts
        coinTypes
      }
    }
  }
`;
const customResolverQuery = (0, graphql_request_1.gql) `
  query getSubgraphRecords($id: String!, $resolverId: String!) {
    domain(id: $id) {
      name
      isMigrated
      createdAt
    }
    resolver(id: $resolverId) {
      texts
      coinTypes
    }
  }
`;
const getCustomResolverResult = async (subgraphClient, { id, resolverAddress, }) => {
    const resolverId = `${resolverAddress.toLowerCase()}-${id}`;
    const response = await subgraphClient.request(customResolverQuery, {
        id,
        resolverId,
    });
    if (!response || !response.domain)
        return null;
    return {
        domain: response.domain,
        resolver: response.resolver,
    };
};
const getInheritedResolverResult = async (subgraphClient, { id, }) => {
    const response = await subgraphClient.request(inheritedResolverQuery, {
        id,
    });
    if (!response || !response.domain)
        return null;
    const { resolver, ...domain } = response.domain;
    return {
        domain,
        resolver,
    };
};
const getSubgraphRecords = async (client, { name, resolverAddress }) => {
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    const id = (0, normalise_js_1.namehash)(name);
    const result = resolverAddress
        ? await getCustomResolverResult(subgraphClient, { id, resolverAddress })
        : await getInheritedResolverResult(subgraphClient, { id });
    if (!result)
        return null;
    const { domain, resolver } = result;
    const { isMigrated, createdAt: stringCreatedAt } = domain;
    const intCreatedAt = parseInt(stringCreatedAt) * 1000;
    const texts = resolver?.texts || [];
    const coins = resolver?.coinTypes || [];
    return {
        isMigrated,
        createdAt: {
            date: new Date(intCreatedAt),
            value: intCreatedAt,
        },
        texts,
        coins,
    };
};
exports.default = getSubgraphRecords;
//# sourceMappingURL=getSubgraphRecords.js.map