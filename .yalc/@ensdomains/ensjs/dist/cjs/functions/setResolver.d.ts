import { ENSArgs } from '..';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { contract, resolver, }: {
    contract: 'registry' | 'nameWrapper';
    resolver?: string;
}): Promise<import("ethers").PopulatedTransaction>;
