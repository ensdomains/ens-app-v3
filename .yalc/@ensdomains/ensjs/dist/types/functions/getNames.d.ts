import { ENSArgs } from '..';
import { AllCurrentFuses } from '../utils/fuses';
export declare type Name = {
    id: string;
    labelName: string | null;
    truncatedName?: string;
    labelhash: string;
    isMigrated: boolean;
    name: string;
    parent: {
        name: string;
    };
    createdAt?: Date;
    registrationDate?: Date;
    expiryDate?: Date;
    fuses?: AllCurrentFuses;
    registration?: {
        expiryDate: Date;
        registrationDate: Date;
    };
    owner?: string;
    manager?: string;
    type: 'domain' | 'registration' | 'wrappedDomain';
};
declare type BaseParams = {
    address: string;
    type: 'registrant' | 'owner' | 'wrappedOwner' | 'all' | 'resolvedAddress';
    page?: number;
    pageSize?: number;
    orderDirection?: 'asc' | 'desc';
};
declare type RegistrantParams = {
    type: 'registrant';
    orderBy?: 'registrationDate' | 'expiryDate' | 'labelName';
};
declare type OwnerParams = {
    type: 'owner';
    orderBy?: 'createdAt' | 'labelName';
};
declare type WrappedOwnerParams = {
    type: 'wrappedOwner';
    orderBy?: 'expiryDate' | 'name';
};
declare type AllParams = {
    type: 'all';
    orderBy?: 'labelName' | 'creationDate';
    page?: never;
    pageSize?: never;
};
declare type ResolvedAddressParams = {
    type: 'resolvedAddress';
    orderBy?: 'labelName' | 'createdAt';
    page?: never;
    pageSize?: never;
};
declare type Params = BaseParams & (RegistrantParams | OwnerParams | WrappedOwnerParams | AllParams | ResolvedAddressParams);
declare const getNames: ({ gqlInstance }: ENSArgs<'gqlInstance'>, { address: _address, type, page, pageSize, orderDirection, orderBy, }: Params) => Promise<Name[]>;
export default getNames;
