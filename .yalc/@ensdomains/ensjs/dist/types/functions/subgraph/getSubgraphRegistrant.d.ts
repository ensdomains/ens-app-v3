import { type Address } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
export type GetSubgraphRegistrantParameters = {
    /** Name to get registrant for */
    name: string;
};
export type GetSubgraphRegistrantReturnType = Address | null;
/**
 * Gets the name registrant from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSubgraphRegistrantParameters}
 * @returns Registrant address, or null if name was not found. {@link GetSubgraphRegistrantReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSubgraphRegistrant } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSubgraphRegistrant(client, { name: 'ens.eth' })
 * // 0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9
 */
declare const getSubgraphRegistrant: (client: ClientWithEns, { name }: GetSubgraphRegistrantParameters) => Promise<GetSubgraphRegistrantReturnType>;
export default getSubgraphRegistrant;
//# sourceMappingURL=getSubgraphRegistrant.d.ts.map