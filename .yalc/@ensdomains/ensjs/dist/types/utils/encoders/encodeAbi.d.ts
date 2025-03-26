import { type Hex } from 'viem';
import type { Prettify } from '../../types.js';
export type AbiEncodeAs = 'json' | 'zlib' | 'cbor' | 'uri';
type AbiContentType = 1 | 2 | 4 | 8;
declare const abiEncodeMap: {
    readonly json: 1;
    readonly zlib: 2;
    readonly cbor: 4;
    readonly uri: 8;
};
type AbiEncodeMap = typeof abiEncodeMap;
type GetAbiContentType<TEncodeAs extends AbiEncodeAs> = AbiEncodeMap[TEncodeAs];
export type EncodeAbiParameters<TEncodeAs extends AbiEncodeAs = AbiEncodeAs> = TEncodeAs extends 'uri' ? {
    encodeAs: TEncodeAs;
    data: string | null;
} : {
    encodeAs: TEncodeAs;
    data: Record<any, any> | null;
};
export type EncodedAbi<TContentType extends AbiContentType = AbiContentType> = {
    contentType: TContentType;
    encodedData: Hex;
};
export type EncodeAbiReturnType<TContentType extends AbiContentType> = EncodedAbi<TContentType>;
export declare const contentTypeToEncodeAs: (contentType: AbiContentType) => AbiEncodeAs;
export declare const encodeAsToContentType: (encodeAs: AbiEncodeAs) => AbiContentType;
export declare const encodeAbi: <TEncodeAs extends AbiEncodeAs, TContentType extends GetAbiContentType<TEncodeAs>>({ encodeAs, data, }: EncodeAbiParameters<TEncodeAs>) => Promise<{
    contentType: TContentType;
    encodedData: Hex;
}>;
export {};
//# sourceMappingURL=encodeAbi.d.ts.map