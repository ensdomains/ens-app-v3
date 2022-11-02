import { ethers } from 'ethers';
import { ENSArgs } from '..';
import { FuseOptions } from '../utils/fuses';
import { Expiry } from '../utils/wrapper';
export default function ({ contracts, signer, getExpiry, }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>, name: string, { wrappedOwner, fuseOptions, expiry, resolverAddress, }: {
    wrappedOwner: string;
    fuseOptions?: FuseOptions | string | number;
    expiry?: Expiry;
    resolverAddress?: string;
}): Promise<ethers.PopulatedTransaction>;
