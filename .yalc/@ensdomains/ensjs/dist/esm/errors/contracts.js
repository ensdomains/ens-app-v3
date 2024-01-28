import { BaseError } from './base.js';
export class UnsupportedNetworkError extends BaseError {
    constructor({ network, supportedNetworks, details, }) {
        super(`Unsupported network: ${network}`, {
            metaMessages: [`- Supported networks: ${supportedNetworks.join(', ')}`],
            details,
        });
        Object.defineProperty(this, "network", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedNetworks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'UnsupportedNetworkError'
        });
        this.network = network;
        this.supportedNetworks = supportedNetworks;
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