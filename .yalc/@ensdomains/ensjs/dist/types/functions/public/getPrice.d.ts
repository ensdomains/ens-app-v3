import { BaseError, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
export type GetPriceParameters = {
    /** Name, or array of names, to get price for */
    nameOrNames: string | string[];
    /** Duration in seconds to get price for */
    duration: bigint | number;
};
export type GetPriceReturnType = {
    /** Price base value */
    base: bigint;
    /** Price premium */
    premium: bigint;
};
declare const encode: (client: ClientWithEns, { nameOrNames, duration }: GetPriceParameters) => SimpleTransactionRequest;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, { nameOrNames }: GetPriceParameters) => Promise<GetPriceReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the price of a name, or array of names, for a given duration.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetPriceParameters}
 * @returns Price data object. {@link GetPriceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getPrice(client, { nameOrNames: 'ens.eth', duration: 31536000 })
 * // { base: 352828971668930335n, premium: 0n }
 */
declare const getPrice: ((client: ClientWithEns, { nameOrNames, duration }: GetPriceParameters) => Promise<GetPriceReturnType>) & BatchableFunctionObject;
export default getPrice;
//# sourceMappingURL=getPrice.d.ts.map