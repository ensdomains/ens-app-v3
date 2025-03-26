import { type Address, type Hex } from 'viem';
import { type EncodeChildFusesInputObject } from './fuses.js';
import { type RecordOptions } from './generateRecordCallArray.js';
export type RegistrationParameters = {
    /** Name to register */
    name: string;
    /** Address to set owner to */
    owner: Address;
    /** Duration of registration */
    duration: number;
    /** Random 32 bytes to use for registration */
    secret: Hex;
    /** Custom resolver address, defaults to current public resolver deployment */
    resolverAddress?: Address;
    /** Records to set upon registration */
    records?: RecordOptions;
    /** Sets primary name upon registration */
    reverseRecord?: boolean;
    /** Fuses to set upon registration */
    fuses?: EncodeChildFusesInputObject;
};
export type CommitmentTuple = [
    labelHash: Hex,
    owner: Address,
    duration: bigint,
    secret: Hex,
    resolver: Address,
    data: Hex[],
    reverseRecord: boolean,
    ownerControlledFuses: number
];
export type RegistrationTuple = [
    label: string,
    owner: Address,
    duration: bigint,
    secret: Hex,
    resolver: Address,
    data: Hex[],
    reverseRecord: boolean,
    ownerControlledFuses: number
];
export declare const randomSecret: ({ platformDomain, campaign, }?: {
    platformDomain?: string | undefined;
    campaign?: number | undefined;
}) => `0x${string}`;
export declare const makeCommitmentTuple: ({ name, owner, duration, resolverAddress, records: { coins, ...records }, reverseRecord, fuses, secret, }: RegistrationParameters) => CommitmentTuple;
export declare const makeRegistrationTuple: (params: RegistrationParameters) => RegistrationTuple;
export declare const makeCommitmentFromTuple: (params: CommitmentTuple) => Hex;
export declare const makeCommitment: (params: RegistrationParameters) => Hex;
//# sourceMappingURL=registerHelpers.d.ts.map