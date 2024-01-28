import { getContractError, type BaseError, type Hex } from 'viem';
import type { Prettify } from '../types.js';
type CheckSafeUniversalResolverDataParameters = Prettify<{
    strict: boolean | undefined;
    args: any[] | (() => any[]);
} & Omit<Parameters<typeof getContractError>[1], 'args'>>;
/**
 * Checks if the data returned from a universal resolver is safe to use, or if it is a known revert error
 * @param parameters - {@link CheckSafeUniversalResolverDataParameters}
 * @returns `true` if the data is safe to use, `false` if it is a known revert error, or throws if it is an unknown error
 */
export declare const checkSafeUniversalResolverData: (data: Hex | BaseError, { strict, abi, args, functionName, address, docsPath, sender, }: CheckSafeUniversalResolverDataParameters) => data is `0x${string}`;
export {};
//# sourceMappingURL=checkSafeUniversalResolverData.d.ts.map