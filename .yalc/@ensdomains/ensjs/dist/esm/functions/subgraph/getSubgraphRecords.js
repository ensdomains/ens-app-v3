import { gql } from 'graphql-request';
import { namehash } from '../../utils/normalise.js';
import { createSubgraphClient } from './client.js';
const inheritedResolverQuery = gql `
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
const customResolverQuery = gql `
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
/**
 * Gets the records for a name from the subgraph
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSubgraphRecordsParameters}
 * @returns Record object, or null if name was not found. {@link GetSubgraphRecordsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSubgraphRecords(client, { name: 'ens.eth' })
 * // {
 * //   isMigrated: true,
 * //   createdAt: { date: 2019-08-26T05:09:01.000Z, value: 1566796141000 },
 * //   texts: [ 'snapshot', 'url', 'avatar', 'com.twitter', 'com.github' ],
 * //   coins: [ '60' ]
 * // }
 */
const getSubgraphRecords = async (client, { name, resolverAddress }) => {
    const subgraphClient = createSubgraphClient({ client });
    const id = namehash(name);
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
export default getSubgraphRecords;
//# sourceMappingURL=getSubgraphRecords.js.map