import type { FuseOptions } from '../@types/FuseOptions';
import type { PublicResolver } from '../generated';
import { RecordOptions } from './recordHelpers';
export declare const randomSecret: () => string;
export declare const makeCommitment: ({ name, owner, duration, resolver, records, reverseRecord, fuses, }: {
    name: string;
    owner: string;
    duration: number;
    resolver: PublicResolver;
    records?: RecordOptions | undefined;
    reverseRecord?: boolean | undefined;
    fuses?: FuseOptions | undefined;
}) => {
    secret: string;
    commitment: string;
};
export declare const _makeCommitment: ({ labelhash, owner, duration, secret, resolver, data, reverseRecord, fuses, }: {
    labelhash: string;
    owner: string;
    duration: number;
    secret: string;
    resolver: string;
    data: string[];
    reverseRecord: boolean;
    fuses: string;
}) => string;
