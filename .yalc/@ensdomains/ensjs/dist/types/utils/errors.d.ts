declare type ErrorName = 'ENSJSSubgraphIndexingError' | 'ENSJSUnknownError';
export declare class ENSJSError<T> extends Error {
    name: ErrorName;
    data: T | undefined;
    timestamp: number | undefined;
    constructor({ name, data, timestamp, }: {
        name: ErrorName;
        data?: T;
        timestamp?: number;
    });
}
declare type Meta = {
    hasIndexingErrors: boolean;
    block: {
        number: number;
    };
};
export declare const returnOrThrow: <T>(data: T, meta?: Meta, provider?: any) => Promise<T>;
export {};
