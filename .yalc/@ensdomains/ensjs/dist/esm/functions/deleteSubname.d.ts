import { ENSArgs } from '..';
export default function ({ transferSubname, signer }: ENSArgs<'transferSubname' | 'signer'>, name: string, { contract, }: {
    contract: 'registry' | 'nameWrapper';
}): Promise<import("ethers").PopulatedTransaction>;
