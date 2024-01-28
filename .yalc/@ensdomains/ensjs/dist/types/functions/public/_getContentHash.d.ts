import { type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest } from '../../types.js';
import { type DecodedContentHash } from '../../utils/contentHash.js';
export type InternalGetContentHashParameters = {
    /** Name to get content hash record for */
    name: string;
    /** Whether or not to throw decoding errors */
    strict?: boolean;
};
export type InternalGetContentHashReturnType = Prettify<DecodedContentHash | null>;
declare const _getContentHash: import("../../utils/generateFunction.js").GeneratedFunction<(_client: ClientWithEns, { name }: Omit<InternalGetContentHashParameters, 'strict'>) => SimpleTransactionRequest, (_client: ClientWithEns, data: Hex, { strict }: Pick<InternalGetContentHashParameters, 'strict'>) => Promise<InternalGetContentHashReturnType>>;
export default _getContentHash;
//# sourceMappingURL=_getContentHash.d.ts.map