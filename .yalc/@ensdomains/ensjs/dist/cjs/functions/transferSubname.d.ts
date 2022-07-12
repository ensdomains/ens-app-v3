import { ethers } from 'ethers';
import { ENSArgs } from '..';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { contract, address, }: {
    contract: 'registry' | 'nameWrapper';
    address: string;
}): Promise<ethers.ContractTransaction>;
