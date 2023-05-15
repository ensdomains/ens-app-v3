import { ENSArgs } from '..';
export declare type Owner = {
    registrant?: string;
    owner?: string;
    ownershipLevel: 'nameWrapper' | 'registry' | 'registrar';
    expired?: boolean;
};
declare type GetOwnerOptions = {
    contract?: 'nameWrapper' | 'registry' | 'registrar';
    skipGraph?: boolean;
};
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string, options?: GetOwnerOptions) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, multicallWrapper, gqlInstance, }: ENSArgs<"contracts" | "gqlInstance" | "multicallWrapper">, data: string, name: string, options?: GetOwnerOptions) => Promise<Owner | undefined>;
};
export default _default;
