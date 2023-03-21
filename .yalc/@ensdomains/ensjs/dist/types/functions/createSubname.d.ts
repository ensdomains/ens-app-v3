import { ENSArgs } from '..';
import { CombinedFuseInput } from '../utils/fuses';
import { Expiry } from '../utils/wrapper';
declare type BaseArgs = {
    owner: string;
    resolverAddress?: string;
    contract: 'registry' | 'nameWrapper';
};
declare type NameWrapperArgs = {
    contract: 'nameWrapper';
    fuses?: CombinedFuseInput;
    expiry?: Expiry;
} & BaseArgs;
declare type Args = BaseArgs | NameWrapperArgs;
export default function ({ contracts, signer, getExpiry, }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>, name: string, { owner, resolverAddress, contract, ...wrapperArgs }: Args): Promise<import("ethers").PopulatedTransaction>;
export {};
