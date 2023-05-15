import { ENSArgs } from '..';
import { DecodedContentHash } from '../utils/contentHash';
declare type FallbackRecords = {
    contentHash?: boolean;
    texts?: string[];
    coinTypes?: string[];
};
declare type DataItem = {
    key: string | number;
    type: 'addr' | 'text' | 'contentHash';
    coin?: string;
    value: string;
};
declare type ResolvedProfile = {
    isMigrated: boolean | null;
    createdAt: string | null;
    address?: string;
    name?: string | null;
    decryptedName?: string | null;
    match?: boolean;
    message?: string;
    records?: {
        contentHash?: DecodedContentHash | string | null;
        texts?: DataItem[];
        coinTypes?: DataItem[];
    };
    resolverAddress?: string;
    isInvalidResolverAddress?: boolean;
    reverseResolverAddress?: string;
};
declare type ProfileOptions = {
    contentHash?: boolean;
    texts?: boolean | string[];
    coinTypes?: boolean | string[];
};
declare type InputProfileOptions = ProfileOptions & {
    resolverAddress?: string;
    fallback?: FallbackRecords;
    skipGraph?: boolean;
};
export default function ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, multicallWrapper, }: ENSArgs<'contracts' | 'gqlInstance' | 'getName' | '_getText' | '_getAddr' | '_getContentHash' | 'resolverMulticallWrapper' | 'multicallWrapper'>, nameOrAddress: string, options?: InputProfileOptions): Promise<ResolvedProfile | undefined>;
export {};
