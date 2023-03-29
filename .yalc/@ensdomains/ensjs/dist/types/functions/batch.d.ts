import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BatchFunctionResult, ENSArgs, RawFunction } from '..';
declare const _default: {
    raw: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, ...items: BatchFunctionResult<RawFunction>[]) => Promise<{
        passthrough: {
            to: string;
            data: string;
        }[];
        to: string;
        data: string;
    }>;
    decode: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, data: string, passthrough: TransactionRequest & {
        passthrough?: any;
    }[], ...items: BatchFunctionResult<RawFunction>[]) => Promise<any[] | undefined>;
};
export default _default;
