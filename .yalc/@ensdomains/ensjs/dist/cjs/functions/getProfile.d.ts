import { ENSArgs } from '..';
import { DecodedContentHash } from '../utils/contentHash';
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
    match?: boolean;
    message?: string;
    records?: {
        contentHash?: DecodedContentHash | string | null;
        texts?: DataItem[];
        coinTypes?: DataItem[];
    };
    resolverAddress?: string;
    reverseResolverAddress?: string;
};
declare type ProfileOptions = {
    contentHash?: boolean;
    texts?: boolean | string[];
    coinTypes?: boolean | string[];
};
export default function ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }: ENSArgs<'contracts' | 'gqlInstance' | 'getName' | '_getText' | '_getAddr' | '_getContentHash' | 'resolverMulticallWrapper'>, nameOrAddress: string, options?: ProfileOptions): Promise<ResolvedProfile | undefined>;
export {};
