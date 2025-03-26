import { createClient, } from 'viem';
import { addEnsContracts } from '../contracts/addEnsContracts.js';
import { ensSubgraphActions, } from './decorators/subgraph.js';
/**
 * Creates a ENS Subgraph Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsSubgraphClientConfig}
 * @returns An ENS Subgraph Client. {@link EnsSubgraphClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsSubgraphClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsSubgraphClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export const createEnsSubgraphClient = ({ batch, chain, key = 'ensSubgraph', name = 'ENS Subgraph Client', transport, pollingInterval, }) => {
    return createClient({
        batch,
        chain: addEnsContracts(chain),
        key,
        name,
        pollingInterval,
        transport,
        type: 'ensSubgraphClient',
    }).extend(ensSubgraphActions);
};
//# sourceMappingURL=subgraph.js.map