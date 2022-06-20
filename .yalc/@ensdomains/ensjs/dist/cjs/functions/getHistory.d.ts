import { ENSArgs } from '..';
export declare function getHistory({ gqlInstance }: ENSArgs<'gqlInstance'>, name: string): Promise<{
    domain: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
    registration: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
    resolver: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
} | undefined>;
export declare function getHistoryWithDetail({ contracts, gqlInstance, provider, }: ENSArgs<'contracts' | 'gqlInstance' | 'provider'>, name: string): Promise<{
    domain: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
    registration: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
    resolver: {
        type: any;
        blockNumber: any;
        transactionHash: any;
        id: any;
        data: Record<string, any>;
    }[];
} | undefined>;
export declare function getHistoryDetailForTransactionHash({ contracts, provider }: ENSArgs<'contracts' | 'provider'>, hash: string, indexInTransaction?: number): Promise<({
    key: any;
    value: any;
} | undefined)[] | {
    key: any;
    value: any;
} | undefined>;
