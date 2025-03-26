import { BaseError } from './base.js';
export class InvalidFilterKeyError extends BaseError {
    constructor({ filterKey, supportedFilterKeys, }) {
        super(`Invalid filter key: ${filterKey}`, {
            metaMessages: [
                `- Supported filter keys: ${supportedFilterKeys.join(', ')}`,
            ],
        });
        Object.defineProperty(this, "filterKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedFilterKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidFilterKeyError'
        });
        this.filterKey = filterKey;
        this.supportedFilterKeys = supportedFilterKeys;
    }
}
export class FilterKeyRequiredError extends BaseError {
    constructor({ supportedFilterKeys, details, }) {
        super('At least one filter key is required', {
            metaMessages: [
                `- Supported filter keys: ${supportedFilterKeys.join(', ')}`,
            ],
            details,
        });
        Object.defineProperty(this, "supportedFilterKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FilterKeyRequiredError'
        });
        this.supportedFilterKeys = supportedFilterKeys;
    }
}
export class InvalidOrderByError extends BaseError {
    constructor({ orderBy, supportedOrderBys, }) {
        super(`Invalid orderBy: ${orderBy}`, {
            metaMessages: [
                `- Supported orderBy keys: ${supportedOrderBys.join(', ')}`,
            ],
        });
        Object.defineProperty(this, "orderBy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedOrderBys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidOrderByError'
        });
        this.orderBy = orderBy;
        this.supportedOrderBys = supportedOrderBys;
    }
}
//# sourceMappingURL=subgraph.js.map