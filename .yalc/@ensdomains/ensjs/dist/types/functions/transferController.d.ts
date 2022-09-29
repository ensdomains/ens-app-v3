import { ethers } from 'ethers';
import { ENSArgs } from '..';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { newOwner, }: {
    newOwner: string;
}): Promise<ethers.PopulatedTransaction>;
