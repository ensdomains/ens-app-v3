import { ethers } from 'ethers';
import { ENSArgs } from '..';
import type { FuseOptions } from '../@types/FuseOptions';
import { Expiry } from '../utils/wrapper';
export default function ({ contracts, signer, getExpiry, }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>, name: string, { wrappedOwner, fuseOptions, expiry, resolverAddress, }: {
    wrappedOwner: string;
    fuseOptions?: FuseOptions | string | number;
    expiry?: Expiry;
    resolverAddress?: string;
}): Promise<ethers.PopulatedTransaction>;
