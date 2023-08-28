import { GraphQLError } from 'graphql';
export declare type ENSJSErrorName = 'ENSJSSubgraphError';
export declare class ENSJSError<T> extends Error {
    name: string;
    errors?: GraphQLError[];
    data?: T;
    constructor({ data, errors }: {
        data?: T;
        errors?: GraphQLError[];
    });
}
export declare const getClientErrors: (e: unknown) => GraphQLError[];
export declare const debugSubgraphError: (request: any) => void;
export declare const debugSubgraphLatency: () => Promise<void> | undefined;
