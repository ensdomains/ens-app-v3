import { ENSArgs } from '..';
import { fuseEnum } from '../utils/fuses';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { fusesToBurn, }: {
    fusesToBurn: Set<Partial<keyof typeof fuseEnum>>;
}): Promise<import("ethers").PopulatedTransaction>;
