import type { PublicResolver } from '../generated';
declare type RecordItem = {
    key: string;
    value: string;
};
export declare type RecordOptions = {
    contentHash?: string;
    texts?: RecordItem[];
    coinTypes?: RecordItem[];
};
export declare const generateSetAddr: (namehash: string, coinType: string, address: string, resolver: PublicResolver) => string;
export declare const generateRecordCallArray: (namehash: string, records: RecordOptions, resolver: PublicResolver) => string[];
export {};
