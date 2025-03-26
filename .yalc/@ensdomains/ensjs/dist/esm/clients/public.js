import { createClient, } from 'viem';
import { addEnsContracts } from '../contracts/addEnsContracts.js';
import { ensPublicActions } from './decorators/public.js';
import { ensSubgraphActions, } from './decorators/subgraph.js';
/**
 * Creates a ENS Public Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsPublicClientConfig}
 * @returns An ENS Public Client. {@link EnsPublicClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsPublicClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export const createEnsPublicClient = ({ batch, chain, key = 'ensPublic', name = 'ENS Public Client', transport, pollingInterval, }) => {
    return createClient({
        batch,
        chain: addEnsContracts(chain),
        key,
        name,
        pollingInterval,
        transport,
        type: 'ensPublicClient',
    })
        .extend(ensPublicActions)
        .extend(ensSubgraphActions);
};
//# sourceMappingURL=public.js.map