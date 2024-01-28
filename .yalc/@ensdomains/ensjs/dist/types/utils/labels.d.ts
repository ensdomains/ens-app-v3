import { type Hex } from 'viem';
export declare function decodeLabelhash(hash: string): Hex;
export declare function encodeLabelhash(hash: string): string;
export declare function isEncodedLabelhash(hash: string): boolean;
export declare function saveLabel(label: string): string;
export declare function saveName(name: string): void;
export declare function checkLabel(hash: string): string;
export declare function checkIsDecrypted(string: string | string[]): boolean;
export declare function decryptName(name: string): string;
//# sourceMappingURL=labels.d.ts.map