import getDecodedName, {} from '../../functions/subgraph/getDecodedName.js';
import getNameHistory, {} from '../../functions/subgraph/getNameHistory.js';
import getNamesForAddress, {} from '../../functions/subgraph/getNamesForAddress.js';
import getSubgraphRecords, {} from '../../functions/subgraph/getSubgraphRecords.js';
import getSubgraphRegistrant, {} from '../../functions/subgraph/getSubgraphRegistrant.js';
import getSubnames, {} from '../../functions/subgraph/getSubnames.js';
/**
 * Extends the viem client with ENS subgraph actions
 * @param client - The viem {@link Client} object to add the ENS subgraph actions to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * }).extend(ensSubgraphActions)
 */
export const ensSubgraphActions = (client) => ({
    getDecodedName: (parameters) => getDecodedName(client, parameters),
    getNameHistory: (parameters) => getNameHistory(client, parameters),
    getNamesForAddress: (parameters) => getNamesForAddress(client, parameters),
    getSubgraphRecords: (parameters) => getSubgraphRecords(client, parameters),
    getSubgraphRegistrant: (parameters) => getSubgraphRegistrant(client, parameters),
    getSubnames: (parameters) => getSubnames(client, parameters),
});
//# sourceMappingURL=subgraph.js.map