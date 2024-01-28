import type { Address } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DateWithValue } from '../../types.js';
export type GetSubgraphRecordsParameters = {
    /** Name to get records for */
    name: string;
    /** Resolver address to use */
    resolverAddress?: Address;
};
export type GetSubgraphRecordsReturnType = {
    /** Name migration status from old ENS registry */
    isMigrated: boolean;
    /** Initial name creation time */
    createdAt: DateWithValue<number>;
    /** Array of text record keys */
    texts: string[];
    /** Array of coin ids */
    coins: string[];
} | null;
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
declare const getSubgraphRecords: (client: ClientWithEns, { name, resolverAddress }: GetSubgraphRecordsParameters) => Promise<GetSubgraphRecordsReturnType>;
export default getSubgraphRecords;
//# sourceMappingURL=getSubgraphRecords.d.ts.map