import { BaseError, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DateWithValue, Prettify, SimpleTransactionRequest } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
type ContractOption = 'registrar' | 'nameWrapper';
type ExpiryStatus = 'active' | 'expired' | 'gracePeriod';
export type GetExpiryParameters = Prettify<{
    /** Name to get expiry for */
    name: string;
    /** Optional specific contract to use to get expiry */
    contract?: ContractOption;
}>;
export type GetExpiryReturnType = Prettify<{
    /** Expiry value */
    expiry: DateWithValue<bigint>;
    /** Grace period value (in seconds) */
    gracePeriod: number;
    /** Status of name */
    status: ExpiryStatus;
} | null>;
declare const encode: (client: ClientWithEns, { name, contract }: GetExpiryParameters) => SimpleTransactionRequest;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, { name, contract }: GetExpiryParameters) => Promise<GetExpiryReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the expiry for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetExpiryParameters}
 * @returns Expiry object, or `null` if no expiry. {@link GetExpiryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getExpiry } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getExpiry(client, { name: 'ens.eth' })
 * // { expiry: { date: Date, value: 1913933217n }, gracePeriod: 7776000, status: 'active' }
 */
declare const getExpiry: ((client: ClientWithEns, { name, contract }: GetExpiryParameters) => Promise<GetExpiryReturnType>) & BatchableFunctionObject;
export default getExpiry;
//# sourceMappingURL=getExpiry.d.ts.map