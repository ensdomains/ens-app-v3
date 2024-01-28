import { type Hex } from 'viem';
export type EncodeSetTextParameters = {
    namehash: Hex;
    key: string;
    value: string | null;
};
export type EncodeSetTextReturnType = Hex;
export declare const encodeSetText: ({ namehash, key, value, }: EncodeSetTextParameters) => EncodeSetTextReturnType;
//# sourceMappingURL=encodeSetText.d.ts.map