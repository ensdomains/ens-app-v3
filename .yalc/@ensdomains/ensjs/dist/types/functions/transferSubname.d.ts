import { ethers } from 'ethers';
import { ENSArgs } from '..';
import { Expiry } from '../utils/wrapperExpiry';
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
export default function ({ contracts, signer, getExpiry, }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>, name: string, { contract, owner, resolverAddress, ...wrapperArgs }: Args): Promise<ethers.PopulatedTransaction>;
export {};
