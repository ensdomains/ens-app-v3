import type { PublicResolver } from '../generated';
import { CombinedFuseInput } from './fuses';
import { RecordOptions } from './recordHelpers';
export declare type BaseRegistrationParams = {
    owner: string;
    duration: number;
    secret: string;
    resolverAddress?: string;
    records?: RecordOptions;
    reverseRecord?: boolean;
    fuses?: CombinedFuseInput['child'];
};
export declare type RegistrationParams = Omit<BaseRegistrationParams, 'resolverAddress'> & {
    name: string;
    resolver: PublicResolver;
};
export declare type CommitmentParams = Omit<RegistrationParams, 'secret'> & {
    secret?: string;
};
export declare type RegistrationTuple = [
    name: string,
    owner: string,
    duration: number,
    secret: string,
    resolver: string,
    data: string[],
    reverseRecord: boolean,
    ownerControlledFuses: number
];
export declare const randomSecret: () => string;
export declare const makeCommitmentData: ({ name, owner, duration, resolver, records, reverseRecord, fuses, secret, }: Omit<RegistrationParams, "secret"> & {
    secret?: string | undefined;
} & {
    secret: string;
}) => RegistrationTuple;
export declare const makeRegistrationData: (params: RegistrationParams) => RegistrationTuple;
export declare const _makeCommitment: (params: RegistrationTuple) => string;
export declare const makeCommitment: ({ secret, ...inputParams }: CommitmentParams) => {
    secret: string;
    commitment: string;
};
