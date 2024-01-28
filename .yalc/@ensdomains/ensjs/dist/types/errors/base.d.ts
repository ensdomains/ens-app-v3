type BaseErrorParameters = {
    metaMessages?: string[];
} & ({
    cause?: never;
    details?: string;
} | {
    cause: BaseError | Error;
    details?: never;
});
export declare class BaseError extends Error {
    details: string;
    metaMessages?: string[];
    shortMessage: string;
    name: string;
    version: string;
    constructor(shortMesage: string, args?: BaseErrorParameters);
}
export {};
//# sourceMappingURL=base.d.ts.map