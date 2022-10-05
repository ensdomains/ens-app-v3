import { ethers } from 'ethers';
import { ENSArgs } from '..';
export declare const universalWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string, data: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<{
        data: any;
        resolver: any;
    } | undefined>;
};
export declare const resolverMulticallWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, data: {
        to: string;
        data: string;
    }[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<ethers.utils.Result | undefined>;
};
export declare const multicallWrapper: {
    raw({ contracts }: ENSArgs<'contracts'>, transactions: ethers.providers.TransactionRequest[], requireSuccess?: boolean): Promise<{
        to: string;
        data: string;
    }>;
    decode({ contracts }: ENSArgs<'contracts'>, data: string): Promise<any>;
};
