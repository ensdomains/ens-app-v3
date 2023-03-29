import { ENSArgs } from '../index';
import { CombinedFuseInput } from '../utils/fuses';
export declare function setChildFuses({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { fuses, expiry, }: {
    fuses: Partial<CombinedFuseInput> | number;
    expiry?: number;
}): Promise<import("ethers").PopulatedTransaction>;
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, props: CombinedFuseInput['child']): Promise<import("ethers").PopulatedTransaction>;
