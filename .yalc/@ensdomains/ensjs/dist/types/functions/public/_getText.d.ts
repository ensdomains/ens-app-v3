import { type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest } from '../../types.js';
export type InternalGetTextParameters = {
    /** Name to get text record for */
    name: string;
    /** Text record key to get */
    key: string;
    /** Whether or not to throw decoding errors */
    strict?: boolean;
};
export type InternalGetTextReturnType = string | null;
declare const _getText: import("../../utils/generateFunction.js").GeneratedFunction<(_client: ClientWithEns, { name, key }: Omit<InternalGetTextParameters, 'strict'>) => SimpleTransactionRequest, (_client: ClientWithEns, data: Hex, { strict }: Pick<InternalGetTextParameters, 'strict'>) => Promise<InternalGetTextReturnType>>;
export default _getText;
//# sourceMappingURL=_getText.d.ts.map