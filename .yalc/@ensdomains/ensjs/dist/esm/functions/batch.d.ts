import { ENSArgs, GenericGeneratedRawFunction } from '..';
declare type BatchItem = [GenericGeneratedRawFunction, ...any[]];
declare const _default: {
    raw: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, ...items: BatchItem[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, data: string, ...items: BatchItem[]) => Promise<any[] | null>;
};
export default _default;
