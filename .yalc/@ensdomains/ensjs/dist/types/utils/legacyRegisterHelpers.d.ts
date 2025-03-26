import { type Address, type Hex } from 'viem';
export type LegacyRegistrationParameters = {
    /** Name to register */
    name: string;
    /** Address to set owner to */
    owner: Address;
    /** Duration of registration */
    duration: number;
    /** Random 32 bytes to use for registration */
    secret: Hex;
    /** Custom resolver address, defaults to empty address */
    resolverAddress?: Address;
    /** Address to set upon registration, defaults to empty address */
    address?: Address;
};
export type LegacyRegistrationWithConfigParameters = LegacyRegistrationParameters & {
    resolverAddress: Address;
    address?: Address;
};
export declare const isLegacyRegistrationWithConfigParameters: (params: LegacyRegistrationParameters) => params is LegacyRegistrationWithConfigParameters;
export type LegacyCommitmentTuple = [label: string, owner: Address, secret: Hex];
export type LegacyCommitmentWithConfigTuple = [
    label: string,
    owner: Address,
    resolverAddress: Address,
    address: Address,
    secret: Hex
];
export type LegacyRegistrationTuple = [
    label: string,
    owner: Address,
    duration: bigint,
    secret: Hex
];
export type LegacyRegistrationWithConfigTuple = [
    label: string,
    owner: Address,
    duration: bigint,
    secret: Hex,
    resolverAddress: Address,
    address: Address
];
export declare const makeLegacyCommitmentTuple: (params: LegacyRegistrationParameters) => LegacyCommitmentTuple;
export declare const makeLegacyCommitmentWithConfigTuple: (params: LegacyRegistrationWithConfigParameters) => LegacyCommitmentWithConfigTuple;
export declare const makeLegacyRegistrationTuple: ({ name, owner, secret, duration, }: LegacyRegistrationParameters) => LegacyRegistrationTuple;
export declare const makeLegacyRegistrationWithConfigTuple: ({ name, owner, secret, duration, resolverAddress, address, }: LegacyRegistrationWithConfigParameters) => LegacyRegistrationWithConfigTuple;
export declare const makeLegacyCommitmentFromTuple: ([label, ...others]: LegacyCommitmentTuple | LegacyCommitmentWithConfigTuple) => Hex;
export declare const makeLegacyCommitment: (params: LegacyRegistrationParameters | LegacyRegistrationWithConfigParameters) => Hex;
//# sourceMappingURL=legacyRegisterHelpers.d.ts.map