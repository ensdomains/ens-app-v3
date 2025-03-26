"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOrderByError = exports.FilterKeyRequiredError = exports.InvalidFilterKeyError = void 0;
const base_js_1 = require("./base.js");
class InvalidFilterKeyError extends base_js_1.BaseError {
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
exports.InvalidFilterKeyError = InvalidFilterKeyError;
class FilterKeyRequiredError extends base_js_1.BaseError {
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
exports.FilterKeyRequiredError = FilterKeyRequiredError;
class InvalidOrderByError extends base_js_1.BaseError {
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
exports.InvalidOrderByError = InvalidOrderByError;
//# sourceMappingURL=subgraph.js.map