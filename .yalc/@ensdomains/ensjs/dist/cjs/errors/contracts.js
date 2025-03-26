"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoChainError = exports.UnsupportedChainError = void 0;
const base_js_1 = require("./base.js");
class UnsupportedChainError extends base_js_1.BaseError {
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
exports.UnsupportedChainError = UnsupportedChainError;
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