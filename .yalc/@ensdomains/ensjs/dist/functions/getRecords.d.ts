import { ENSArgs } from '..';
declare type ProfileOptions = {
    contentHash?: boolean;
    texts?: boolean | string[];
    coinTypes?: boolean | string[];
};
export default function ({ getProfile }: ENSArgs<'getProfile'>, name: string, options?: ProfileOptions): Promise<{
    address: any;
    records: {
        contentHash?: string | import("../utils/contentHash").DecodedContentHash | null | undefined;
        coinTypes?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
        texts?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
    };
    resolverAddress: any;
} | {
    name: any;
    records: null;
    match: boolean;
    resolverAddress?: undefined;
} | {
    name: any;
    records: {
        contentHash?: string | import("../utils/contentHash").DecodedContentHash | null | undefined;
        coinTypes?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
        texts?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
    };
    match: boolean;
    resolverAddress: any;
} | null>;
export {};
