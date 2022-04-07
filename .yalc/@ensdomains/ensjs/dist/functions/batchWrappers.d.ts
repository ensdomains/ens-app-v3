import { ENSArgs } from '..';
export declare const universalWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string, data: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<{
        data: any;
        resolver: any;
    } | null>;
};
export declare const resolverMulticallWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, data: {
        to: string;
        data: string;
    }[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<import("@ethersproject/abi").Result | null>;
};
