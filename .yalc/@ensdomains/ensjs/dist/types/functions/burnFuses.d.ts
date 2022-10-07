import { ENSArgs } from '..';
import { FuseProps } from '../utils/fuses';
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, props: FuseProps): Promise<import("ethers").PopulatedTransaction>;
