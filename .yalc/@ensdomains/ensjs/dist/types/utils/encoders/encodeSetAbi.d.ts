import { type Hex } from 'viem';
import type { EncodedAbi } from './encodeAbi.js';
export type EncodeSetAbiParameters = {
    namehash: Hex;
} & EncodedAbi;
export type EncodeSetAbiReturnType = Hex;
export declare const encodeSetAbi: ({ namehash, contentType, encodedData, }: EncodeSetAbiParameters) => EncodeSetAbiReturnType;
//# sourceMappingURL=encodeSetAbi.d.ts.map