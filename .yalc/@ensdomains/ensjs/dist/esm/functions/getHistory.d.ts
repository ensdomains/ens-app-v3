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
