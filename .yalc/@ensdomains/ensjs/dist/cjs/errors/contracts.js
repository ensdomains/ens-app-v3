"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoChainError = exports.UnsupportedNetworkError = void 0;
const base_js_1 = require("./base.js");
class UnsupportedNetworkError extends base_js_1.BaseError {
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
exports.UnsupportedNetworkError = UnsupportedNetworkError;
class NoChainError extends base_js_1.BaseError {
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
exports.NoChainError = NoChainError;
//# sourceMappingURL=contracts.js.map