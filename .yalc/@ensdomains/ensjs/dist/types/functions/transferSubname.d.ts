import { ENSArgs } from '..';
import { Expiry } from '../utils/wrapper';
declare type BaseArgs = {
    owner: string;
    resolverAddress?: string;
    contract: 'registry' | 'nameWrapper';
};
declare type NameWrapperArgs = {
    contract: 'nameWrapper';
    expiry?: Expiry;
} & BaseArgs;
declare type Args = BaseArgs | NameWrapperArgs;
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { contract, owner, resolverAddress, ...wrapperArgs }: Args): Promise<import("ethers").PopulatedTransaction>;
export {};
