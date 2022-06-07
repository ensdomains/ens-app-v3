import { ethers } from 'ethers';
import { ENSArgs } from '..';
import type { FuseOptions } from '../@types/FuseOptions';
export default function ({ contracts, provider }: ENSArgs<'contracts' | 'provider'>, name: string, wrappedOwner: string, fuseOptions?: FuseOptions | string | number, resolverAddress?: string, options?: {
    addressOrIndex?: string | number;
}): Promise<ethers.ContractTransaction>;
