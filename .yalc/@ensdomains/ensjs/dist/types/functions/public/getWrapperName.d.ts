import { BaseError, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, TransactionRequestWithPassthrough } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
export type GetWrapperNameParameters = {
    /** Name with unknown labels, e.g. "[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth" */
    name: string;
};
export type GetWrapperNameReturnType = string | null;
declare const encode: (client: ClientWithEns, { name }: GetWrapperNameParameters) => TransactionRequestWithPassthrough;
declare const decode: (_client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough) => Promise<GetWrapperNameReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the full name for a name with unknown labels from the NameWrapper.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetWrapperNameParameters}
 * @returns Full name, or null if name was not found. {@link GetWrapperNameReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getWrapperName } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getWrapperName(client, { name: '[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth' })
 * // wrapped.eth
 */
declare const getWrapperName: ((client: ClientWithEns, { name }: GetWrapperNameParameters) => Promise<GetWrapperNameReturnType>) & BatchableFunctionObject;
export default getWrapperName;
//# sourceMappingURL=getWrapperName.d.ts.map