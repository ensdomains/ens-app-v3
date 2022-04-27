import { ENSArgs } from '..';
export declare function _getOwner({ contracts }: ENSArgs<'contracts'>, name: string): Promise<{
    registryOwner: any;
    nameWrapperOwner: any;
    registrarOwner: any;
}>;
export declare function getOwner({ contracts }: ENSArgs<'contracts'>, name: string): Promise<{
    owner: any;
    ownershipLevel: string;
    registrant?: undefined;
} | {
    registrant: any;
    owner: any;
    ownershipLevel: string;
} | null>;
