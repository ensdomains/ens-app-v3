import { ENSArgs } from '..';
declare type DomainEvent = 'NewOwner' | 'NewResolver' | 'Transfer' | 'NewTTL' | 'WrappedTransfer' | 'NameWrapped' | 'NameUnwrapped' | 'FusesSet' | 'ExpiryExtended';
declare type RegistrationEvent = 'NameRegistered' | 'NameRenewed' | 'NameTransferred';
declare type ResolverEvent = 'AddrChanged' | 'MulticoinAddrChanged' | 'NameChanged' | 'AbiChanged' | 'PubkeyChanged' | 'TextChanged' | 'ContenthashChanged' | 'InterfaceChanged' | 'AuthorisationChanged' | 'VersionChanged';
export declare function getHistory({ gqlInstance }: ENSArgs<'gqlInstance'>, name: string): Promise<{
    domain: {
        type: DomainEvent;
        blockNumber: number;
        transactionHash: string;
        id: string;
        data: object;
    }[];
    registration: {
        type: RegistrationEvent;
        blockNumber: number;
        transactionHash: string;
        id: string;
        data: object;
    }[];
    resolver: {
        type: ResolverEvent;
        blockNumber: number;
        transactionHash: string;
        id: string;
        data: object;
    }[];
} | undefined>;
export {};
