import { ENSArgs } from '..';
import { DecodedContentHash } from '../utils/contentHash';
declare type DataItem = {
    key: string | number;
    type: 'addr' | 'text' | 'contentHash';
    coin?: string;
    value: string;
};
declare type ProfileOptions = {
    contentHash?: boolean;
    texts?: boolean | string[];
    coinTypes?: boolean | string[];
};
export default function ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }: ENSArgs<'contracts' | 'gqlInstance' | 'getName' | '_getText' | '_getAddr' | '_getContentHash' | 'resolverMulticallWrapper'>, nameOrAddress: string, options?: ProfileOptions): Promise<{
    address: any;
    records: {
        contentHash?: string | DecodedContentHash | null | undefined;
        coinTypes?: DataItem[] | undefined;
        texts?: DataItem[] | undefined;
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
        contentHash?: string | DecodedContentHash | null | undefined;
        coinTypes?: DataItem[] | undefined;
        texts?: DataItem[] | undefined;
    };
    match: boolean;
    resolverAddress: any;
} | null>;
export {};
