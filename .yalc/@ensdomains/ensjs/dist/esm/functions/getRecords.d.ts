import { ENSArgs } from '..';
declare type ProfileOptions = {
    contentHash?: boolean;
    texts?: boolean | string[];
    coinTypes?: boolean | string[];
};
export default function ({ getProfile }: ENSArgs<'getProfile'>, name: string, options?: ProfileOptions): Promise<{
    isMigrated: boolean | null;
    createdAt: string | null;
    address?: string | undefined;
    name?: string | null | undefined;
    match?: boolean | undefined;
    message?: string | undefined;
    records?: {
        contentHash?: string | import("../utils/contentHash").DecodedContentHash | null | undefined;
        texts?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
        coinTypes?: {
            key: string | number;
            type: "addr" | "text" | "contentHash";
            coin?: string | undefined;
            value: string;
        }[] | undefined;
    } | undefined;
    resolverAddress?: string | undefined;
    reverseResolverAddress?: string | undefined;
} | undefined>;
export {};
