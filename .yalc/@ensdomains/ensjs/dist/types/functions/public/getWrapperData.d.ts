import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DateWithValue, GenericPassthrough, Prettify, TransactionRequestWithPassthrough } from '../../types.js';
import { type DecodedFuses } from '../../utils/fuses.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
export type GetWrapperDataParameters = {
    /** Name to get wrapper data for */
    name: string;
};
export type GetWrapperDataReturnType = Prettify<{
    /** Fuse object */
    fuses: DecodedFuses & {
        value: number;
    };
    /** Expiry of the name */
    expiry: DateWithValue<bigint> | null;
    /** Owner of the name */
    owner: Address;
} | null>;
declare const encode: (client: ClientWithEns, { name }: GetWrapperDataParameters) => TransactionRequestWithPassthrough;
declare const decode: (_client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough) => Promise<GetWrapperDataReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the wrapper data for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetWrapperDataParameters}
 * @returns Wrapper data object, or null if name is not wrapped. {@link GetWrapperDataReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getWrapperData } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getWrapperData(client, { name: 'ilikelasagna.eth' })
 */
declare const getWrapperData: ((client: ClientWithEns, { name }: GetWrapperDataParameters) => Promise<GetWrapperDataReturnType>) & BatchableFunctionObject;
export default getWrapperData;
//# sourceMappingURL=getWrapperData.d.ts.map