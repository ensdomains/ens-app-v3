import { ENSArgs } from '..';
export default function ({ transferSubname }: ENSArgs<'transferSubname'>, name: string, { contract, }: {
    contract: 'registry' | 'nameWrapper';
}): Promise<import("ethers").ContractTransaction>;
