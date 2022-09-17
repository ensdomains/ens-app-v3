import type { FuseOptions } from '../@types/FuseOptions';
import type { PublicResolver } from '../generated';
import { RecordOptions } from './recordHelpers';
export declare type RegistrationParams = {
    name: string;
    owner: string;
    duration: number;
    secret: string;
    resolver: PublicResolver;
    records?: RecordOptions;
    reverseRecord?: boolean;
    fuses?: FuseOptions;
    wrapperExpiry: number;
};
export declare type CommitmentParams = Omit<RegistrationParams, 'secret' | 'wrapperExpiry'> & {
    secret?: string;
    wrapperExpiry?: number;
};
export declare type RegistrationTuple = [
    name: string,
    owner: string,
    duration: number,
    secret: string,
    resolver: string,
    data: string[],
    reverseRecord: boolean,
    fuses: string,
    wrapperExpiry: number
];
export declare type CommitmentTuple = [
    labelhash: string,
    owner: string,
    duration: number,
    resolver: string,
    data: string[],
    secret: string,
    reverseRecord: boolean,
    fuses: string,
    wrapperExpiry: number
];
export declare const randomSecret: () => string;
export declare const makeCommitmentData: ({ name, owner, duration, resolver, records, reverseRecord, fuses, wrapperExpiry, secret, }: Omit<RegistrationParams, "secret" | "wrapperExpiry"> & {
    secret?: string | undefined;
    wrapperExpiry?: number | undefined;
} & {
    secret: string;
}) => CommitmentTuple;
export declare const makeRegistrationData: (params: RegistrationParams) => RegistrationTuple;
export declare const _makeCommitment: (params: CommitmentTuple) => string;
export declare const makeCommitment: ({ secret, ...inputParams }: CommitmentParams) => {
    secret: string;
    commitment: string;
    wrapperExpiry: number;
};
