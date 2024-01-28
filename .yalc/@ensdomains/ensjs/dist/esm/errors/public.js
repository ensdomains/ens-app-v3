import { BaseError } from './base.js';
export class CoinFormatterNotFoundError extends BaseError {
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
export class FunctionNotBatchableError extends BaseError {
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
export class NoRecordsSpecifiedError extends BaseError {
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
//# sourceMappingURL=public.js.map