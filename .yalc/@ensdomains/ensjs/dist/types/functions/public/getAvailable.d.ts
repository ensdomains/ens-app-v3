import { BaseError, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
export type GetAvailableParameters = {
    /** Name to check availability for, only compatible for eth 2ld */
    name: string;
};
export type GetAvailableReturnType = boolean;
declare const encode: (client: ClientWithEns, { name }: GetAvailableParameters) => SimpleTransactionRequest;
declare const decode: (_client: ClientWithEns, data: Hex | BaseError) => Promise<GetAvailableReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the availability of a name to register
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAvailableParameters}
 * @returns Availability as boolean. {@link GetAvailableReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAvailable } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAvailable(client, { name: 'ens.eth' })
 * // false
 */
declare const getAvailable: ((client: ClientWithEns, { name }: GetAvailableParameters) => Promise<GetAvailableReturnType>) & BatchableFunctionObject;
export default getAvailable;
//# sourceMappingURL=getAvailable.d.ts.map