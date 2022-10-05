import { BigNumberish } from 'ethers';
import type { FuseOptions } from '../@types/FuseOptions';
import type { PublicResolver } from '../generated';
import { RecordOptions } from './recordHelpers';
export declare const MAX_INT_64: bigint;
export declare type BaseRegistrationParams = {
    owner: string;
    duration: number;
    secret: string;
    resolverAddress?: string;
    records?: RecordOptions;
    reverseRecord?: boolean;
    fuses?: FuseOptions;
    wrapperExpiry?: BigNumberish;
};
export declare type RegistrationParams = Omit<BaseRegistrationParams, 'resolverAddress'> & {
    name: string;
    resolver: PublicResolver;
};
export declare type CommitmentParams = Omit<RegistrationParams, 'secret' | 'wrapperExpiry'> & {
    secret?: string;
    wrapperExpiry?: BigNumberish;
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
    wrapperExpiry: BigNumberish
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
    wrapperExpiry: BigNumberish
];
export declare const randomSecret: () => string;
export declare const makeCommitmentData: ({ name, owner, duration, resolver, records, reverseRecord, fuses, wrapperExpiry, secret, }: Omit<RegistrationParams, "secret" | "wrapperExpiry"> & {
    secret?: string | undefined;
    wrapperExpiry?: BigNumberish | undefined;
} & {
    secret: string;
}) => CommitmentTuple;
export declare const makeRegistrationData: (params: RegistrationParams) => RegistrationTuple;
export declare const _makeCommitment: (params: CommitmentTuple) => string;
export declare const makeCommitment: ({ secret, ...inputParams }: CommitmentParams) => {
    secret: string;
    commitment: string;
    wrapperExpiry: BigNumberish;
};
