import { BaseError } from './base.js';
export declare class CoinFormatterNotFoundError extends BaseError {
    coinType: string | number;
    name: string;
    constructor({ coinType }: {
        coinType: string | number;
    });
}
export declare class FunctionNotBatchableError extends BaseError {
    functionIndex: number;
    name: string;
    constructor({ functionIndex }: {
        functionIndex: number;
    });
}
export declare class NoRecordsSpecifiedError extends BaseError {
    name: string;
    constructor();
}
//# sourceMappingURL=public.d.ts.map