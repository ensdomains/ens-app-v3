import { ENSArgs } from '..';
declare type DomainEvent = 'NewOwner' | 'NewResolver' | 'Transfer' | 'NewTTL' | 'WrappedTransfer' | 'NameWrapped' | 'NameUnwrapped' | 'FusesSet' | 'ExpiryExtended';
declare type RegistrationEvent = 'NameRegistered' | 'NameRenewed' | 'NameTransferred';
declare type ResolverEvent = 'AddrChanged' | 'MulticoinAddrChanged' | 'NameChanged' | 'AbiChanged' | 'PubkeyChanged' | 'TextChanged' | 'ContenthashChanged' | 'InterfaceChanged' | 'AuthorisationChanged' | 'VersionChanged';
declare type EventTypes = 'Domain' | 'Registration' | 'Resolver';
declare type EventFormat = {
    Domain: DomainEvent;
    Registration: RegistrationEvent;
    Resolver: ResolverEvent;
};
declare const mapEvents: <T extends EventTypes>(eventArray: any[], type: T) => {
    type: EventFormat[T];
    blockNumber: number;
    transactionHash: string;
    id: string;
    data: object;
}[];
declare type MappedEvents = ReturnType<typeof mapEvents>;
export declare type ReturnData = {
    domain: MappedEvents;
    registration?: MappedEvents;
    resolver: MappedEvents;
};
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
} | {
    domain: {
        type: DomainEvent;
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
    registration?: undefined;
} | undefined>;
export {};
