import { ENSArgs } from '..';
import { FuseOptions } from '../@types/FuseOptions';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { fusesToBurn, }: {
    fusesToBurn: FuseOptions;
}): Promise<import("ethers").PopulatedTransaction>;
