export declare type ENSJSErrorName = 'ENSJSSubgraphIndexingError' | 'ENSJSUnknownError' | 'ENSJSNetworkLatencyError';
export declare class ENSJSError<T> extends Error {
    name: ENSJSErrorName;
    data: T | undefined;
    timestamp: number | undefined;
    constructor({ name, data, timestamp, }: {
        name: ENSJSErrorName;
        data?: T;
        timestamp?: number;
    });
}
export declare type GraphMeta = {
    hasIndexingErrors: boolean;
    block: {
        number: number;
    };
};
export declare const returnOrThrow: <T>(data: T, meta?: GraphMeta, provider?: any) => Promise<T>;
