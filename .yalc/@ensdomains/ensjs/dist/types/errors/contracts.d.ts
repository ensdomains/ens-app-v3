import { BaseError } from './base.js';
export declare class UnsupportedNetworkError extends BaseError {
    network: string;
    supportedNetworks: readonly string[];
    name: string;
    constructor({ network, supportedNetworks, details, }: {
        network: string;
        supportedNetworks: readonly string[];
        details?: string;
    });
}
export declare class NoChainError extends BaseError {
    name: string;
    constructor();
}
//# sourceMappingURL=contracts.d.ts.map