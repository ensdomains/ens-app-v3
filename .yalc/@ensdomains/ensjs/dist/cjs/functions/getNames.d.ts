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
};
export declare type OwnedName = Name & {
    createdAt: Date;
};
export declare type Registration = Name & {
    registrationDate: Date;
    expiryDate: Date;
};
declare type BaseParams = {
    address: string;
    type: 'registrant' | 'owner';
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
declare type Params = BaseParams & (RegistrantParams | OwnerParams);
declare const getNames: ({ gqlInstance }: ENSArgs<'gqlInstance'>, { address: _address, type, page, pageSize, orderDirection, orderBy, }: Params) => Promise<OwnedName[] | Registration[]>;
export default getNames;
