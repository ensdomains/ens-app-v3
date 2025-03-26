import { BaseError } from './base.js';
export declare class UnsupportedChainError extends BaseError {
    chainId: number;
    supportedChains: readonly number[];
    name: string;
    constructor({ chainId, supportedChains, details, }: {
        chainId: number;
        supportedChains: readonly number[];
        details?: string;
    });
}
export declare class NoChainError extends BaseError {
    name: string;
    constructor();
}
//# sourceMappingURL=contracts.d.ts.map