import { type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DecodedAbi, Prettify, SimpleTransactionRequest } from '../../types.js';
export type InternalGetAbiParameters = {
    /** Name to get ABI record for */
    name: string;
    /** Supported content types as bitwise
     * ID 1: JSON
     * ID 2: zlib compressed JSON
     * ID 4: CBOR
     * ID 8: URI
     */
    supportedContentTypes?: bigint;
    /** Whether or not to throw decoding errors */
    strict?: boolean;
};
export type InternalGetAbiReturnType = Prettify<DecodedAbi | null>;
declare const _getAbi: import("../../utils/generateFunction.js").GeneratedFunction<(_client: ClientWithEns, { name, supportedContentTypes, }: Omit<InternalGetAbiParameters, 'strict'>) => SimpleTransactionRequest, (_client: ClientWithEns, data: Hex, { strict }: Pick<InternalGetAbiParameters, 'strict'>) => Promise<InternalGetAbiReturnType>>;
export default _getAbi;
//# sourceMappingURL=_getAbi.d.ts.map