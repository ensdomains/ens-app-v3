import type { ClientWithEns } from '../../contracts/consts.js';
export type GetDecodedNameParameters = {
    /** Name with unknown labels */
    name: string;
    /** Allow a name with unknown labels to be returned */
    allowIncomplete?: boolean;
};
export type GetDecodedNameReturnType = string | null;
/**
 * Gets the full name for a name with unknown labels from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetDecodedNameParameters}
 * @returns Full name, or null if name was could not be filled. {@link GetDecodedNameReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getDecodedName } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getDecodedName(client, { name: '[5cee339e13375638553bdf5a6e36ba80fb9f6a4f0783680884d92b558aa471da].eth' })
 * // ens.eth
 */
declare const getDecodedName: (client: ClientWithEns, { name, allowIncomplete }: GetDecodedNameParameters) => Promise<GetDecodedNameReturnType>;
export default getDecodedName;
//# sourceMappingURL=getDecodedName.d.ts.map