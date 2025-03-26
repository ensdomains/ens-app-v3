"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRecordsSpecifiedError = exports.FunctionNotBatchableError = exports.CoinFormatterNotFoundError = void 0;
const base_js_1 = require("./base.js");
class CoinFormatterNotFoundError extends base_js_1.BaseError {
    constructor({ coinType }) {
        super(`Coin formatter not found for ${coinType}`);
        Object.defineProperty(this, "coinType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CoinFormatterNotFoundError'
        });
        this.coinType = coinType;
    }
}
exports.CoinFormatterNotFoundError = CoinFormatterNotFoundError;
class FunctionNotBatchableError extends base_js_1.BaseError {
    constructor({ functionIndex }) {
        super(`Function at index ${functionIndex} is not batchable`);
        Object.defineProperty(this, "functionIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FunctionNotBatchableError'
        });
        this.functionIndex = functionIndex;
    }
}
exports.FunctionNotBatchableError = FunctionNotBatchableError;
class NoRecordsSpecifiedError extends base_js_1.BaseError {
    constructor() {
        super('No records specified');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'NoRecordsSpecifiedError'
        });
    }
}
exports.NoRecordsSpecifiedError = NoRecordsSpecifiedError;
//# sourceMappingURL=public.js.map