import { ENSArgs } from '..';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { fuses }: {
    fuses: number;
}): Promise<import("ethers").PopulatedTransaction>;
