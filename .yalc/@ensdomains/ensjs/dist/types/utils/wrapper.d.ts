import type { AnyDate } from '../types.js';
export declare const MAX_EXPIRY: bigint;
export declare const expiryToBigInt: (expiry?: AnyDate, defaultValue?: bigint) => bigint;
export declare const wrappedLabelLengthCheck: (label: string) => void;
export declare const makeDefaultExpiry: (fuses?: number) => bigint;
//# sourceMappingURL=wrapper.d.ts.map