import type { Address, Hex } from 'viem';
export declare const domainDetailsWithoutParentFragment: string;
export declare const domainDetailsFragment: string;
export type SubgraphDomainFragment = {
    id: Hex;
    labelName: string | null;
    labelhash: Hex;
    name: string;
    isMigrated: boolean;
    parent?: {
        name: string;
    };
    createdAt: string;
    resolvedAddress?: {
        id: Address;
    };
    owner: {
        id: Address;
    };
    registrant?: {
        id: Address;
    };
    wrappedOwner?: {
        id: Address;
    };
};
export declare const registrationDetailsFragment: string;
export type SubgraphRegistrationFragment = {
    registrationDate: string;
    expiryDate: string;
};
export declare const wrappedDomainDetailsFragment: string;
export type SubgraphWrappedDomainFragment = {
    expiryDate: string;
    fuses: string;
};
export type SubgraphDomain = SubgraphDomainFragment & {
    registration?: SubgraphRegistrationFragment;
    wrappedDomain?: SubgraphWrappedDomainFragment;
};
//# sourceMappingURL=fragments.d.ts.map