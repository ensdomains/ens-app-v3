import { ENSArgs } from '..';
export declare const _getContentHash: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<{
        protocolType?: undefined;
        decoded?: undefined;
        error?: undefined;
    } | {
        protocolType: null;
        decoded: any;
        error?: undefined;
    } | {
        protocolType: string | undefined;
        decoded: any;
        error: any;
    } | undefined>;
};
export declare const getContentHash: {
    raw: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, data: string) => Promise<{
        protocolType?: undefined;
        decoded?: undefined;
        error?: undefined;
    } | {
        protocolType: null;
        decoded: any;
        error?: undefined;
    } | {
        protocolType: string | undefined;
        decoded: any;
        error: any;
    } | undefined>;
};
export declare const _getText: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string, key: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<any>;
};
export declare const getText: {
    raw: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, name: string, key: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, data: string) => Promise<any>;
};
export declare const _getAddr: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string, coinType?: string | number | undefined, bypassFormat?: boolean | undefined) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
        coin: string;
        addr: string;
    } | undefined>;
};
export declare const getAddr: {
    raw: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, name: string, coinType?: string | number | undefined) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
        coin: string;
        addr: string;
    } | undefined>;
};
