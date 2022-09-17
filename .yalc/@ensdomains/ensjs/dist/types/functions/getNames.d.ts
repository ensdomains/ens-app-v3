import { ENSArgs } from '..';
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
    type: 'domain' | 'registration';
};
declare type BaseParams = {
    address: string;
    type: 'registrant' | 'owner' | 'all';
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
declare type AllParams = {
    type: 'all';
    orderBy?: 'labelName' | 'creationDate';
    page?: never;
    pageSize?: never;
};
declare type Params = BaseParams & (RegistrantParams | OwnerParams | AllParams);
declare const getNames: ({ gqlInstance }: ENSArgs<'gqlInstance'>, { address: _address, type, page, pageSize, orderDirection, orderBy, }: Params) => Promise<Name[]>;
export default getNames;
