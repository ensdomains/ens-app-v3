import { type Address, type Hex } from 'viem';
type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};
export declare const ccipBatchRequest: (callDatas: ReadonlyDeep<[Address, string[], Hex][]>) => Promise<[failures: boolean[], responses: `0x${string}`[]]>;
export {};
//# sourceMappingURL=ccipBatchRequest.d.ts.map