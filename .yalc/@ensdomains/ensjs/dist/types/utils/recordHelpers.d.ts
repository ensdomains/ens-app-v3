import type { PublicResolver } from '../generated';
declare type RecordItem = {
    key: string;
    value: string;
};
export declare type RecordOptions = {
    clearRecords?: boolean;
    contentHash?: string;
    texts?: RecordItem[];
    coinTypes?: RecordItem[];
};
export declare const generateSetAddr: (namehash: string, coinType: string, address: string, resolver: PublicResolver) => string;
export declare type RecordTypes = 'contentHash' | 'text' | 'addr';
export declare type RecordInput<T extends RecordTypes> = T extends 'contentHash' ? string : RecordItem;
export declare function generateSingleRecordCall<T extends RecordTypes>(namehash: string, resolver: PublicResolver, type: T): (record: RecordInput<T>) => string;
export declare const generateRecordCallArray: (namehash: string, records: RecordOptions, resolver: PublicResolver) => string[];
export {};
