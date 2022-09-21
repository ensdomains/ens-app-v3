import { ethers } from 'ethers';
import { ENSArgs } from '..';
declare type Args = {
    contract: 'registry' | 'nameWrapper';
};
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>, name: string, { contract }: Args): Promise<ethers.PopulatedTransaction>;
export {};
