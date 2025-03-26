import { type Address, type Hex } from 'viem';
export type EncodeSetAddrParameters = {
    namehash: Hex;
    coin: string | number;
    value: Address | string | null;
};
export type EncodeSetAddrReturnType = Hex;
export declare const encodeSetAddr: ({ namehash, coin, value, }: EncodeSetAddrParameters) => EncodeSetAddrReturnType;
//# sourceMappingURL=encodeSetAddr.d.ts.map