import { BatchFunctionResult, ENSArgs, RawFunction } from '..';
declare const _default: {
    raw: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, ...items: BatchFunctionResult<RawFunction>[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, data: string, ...items: BatchFunctionResult<RawFunction>[]) => Promise<any[] | null>;
};
export default _default;
