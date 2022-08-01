import { ethers } from 'ethers';
import { ENSArgs } from '..';
import type { FuseOptions } from '../@types/FuseOptions';
export default function ({ contracts, signer, populate }: ENSArgs<'contracts' | 'signer' | 'populate'>, name: string, { wrappedOwner, fuseOptions, resolverAddress, }: {
    wrappedOwner: string;
    fuseOptions?: FuseOptions | string | number;
    resolverAddress?: string;
}): Promise<ethers.PopulatedTransaction>;
