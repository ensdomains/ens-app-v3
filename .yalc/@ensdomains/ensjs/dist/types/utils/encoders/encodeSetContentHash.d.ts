import { type Hex } from 'viem';
export type EncodeSetContentHashParameters = {
    namehash: Hex;
    contentHash: string | null;
};
export type EncodeSetContentHashReturnType = Hex;
export declare const encodeSetContentHash: ({ namehash, contentHash, }: EncodeSetContentHashParameters) => EncodeSetContentHashReturnType;
//# sourceMappingURL=encodeSetContentHash.d.ts.map