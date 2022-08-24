import { ENSArgs } from '..';
import fuseEnum from '../utils/fuses';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { selectedFuses }: {
    selectedFuses: Array<keyof typeof fuseEnum>;
}): Promise<import("ethers").PopulatedTransaction>;
