import { BaseError } from './base.js';
export class UnsupportedChainError extends BaseError {
    constructor({ chainId, supportedChains, details, }) {
        super(`Unsupported chain: ${chainId}`, {
            metaMessages: [`- Supported chains: ${supportedChains.join(', ')}`],
            details,
        });
        Object.defineProperty(this, "chainId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedChains", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'UnsupportedChainError'
        });
        this.chainId = chainId;
        this.supportedChains = supportedChains;
    }
}
export class NoChainError extends BaseError {
    constructor() {
        super('No chain provided');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'NoChainError'
        });
    }
}
//# sourceMappingURL=contracts.js.map