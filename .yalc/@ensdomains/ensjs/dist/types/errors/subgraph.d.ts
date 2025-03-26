import { BaseError } from './base.js';
export declare class InvalidFilterKeyError extends BaseError {
    filterKey: string;
    supportedFilterKeys: readonly string[];
    name: string;
    constructor({ filterKey, supportedFilterKeys, }: {
        filterKey: string;
        supportedFilterKeys: readonly string[];
    });
}
export declare class FilterKeyRequiredError extends BaseError {
    supportedFilterKeys: readonly string[];
    name: string;
    constructor({ supportedFilterKeys, details, }: {
        supportedFilterKeys: readonly string[];
        details?: string;
    });
}
export declare class InvalidOrderByError extends BaseError {
    orderBy: string;
    supportedOrderBys: string[];
    name: string;
    constructor({ orderBy, supportedOrderBys, }: {
        orderBy: string;
        supportedOrderBys: string[];
    });
}
//# sourceMappingURL=subgraph.d.ts.map