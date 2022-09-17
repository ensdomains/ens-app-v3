import { BigNumber } from 'ethers';
import { ENSArgs } from '..';
import { CommitmentParams } from '../utils/registerHelpers';
declare type Params = Omit<CommitmentParams, 'name' | 'resolver'> & {
    resolverAddress?: string;
    secret: string;
    wrapperExpiry: number;
    value: BigNumber;
};
export default function ({ contracts }: ENSArgs<'contracts'>, name: string, { resolverAddress, value, ...params }: Params): Promise<import("ethers").PopulatedTransaction>;
export {};
