import { type Codec as InternalCodec } from '@ensdomains/content-hash';
import { type Hex } from 'viem';
export type ProtocolType = 'ipfs' | 'ipns' | 'bzz' | 'onion' | 'onion3' | 'sia' | 'ar' | null;
export type DecodedContentHash = {
    protocolType: ProtocolType;
    decoded: string;
};
export declare const getDisplayCodec: (encoded: string) => ProtocolType;
export declare const getInternalCodec: (displayCodec: NonNullable<ProtocolType>) => InternalCodec;
export declare function decodeContentHash(encoded: Hex): DecodedContentHash | null;
export declare function isValidContentHash(encoded: unknown): boolean;
export declare function getProtocolType(encoded: string): {
    protocolType: NonNullable<ProtocolType>;
    decoded: string;
} | null;
export declare function encodeContentHash(text: string): Hex;
//# sourceMappingURL=contentHash.d.ts.map