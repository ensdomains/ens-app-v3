import { BigNumber } from 'ethers';
import { ENSArgs } from '..';
export default function ({ contracts }: ENSArgs<'contracts'>, nameOrNames: string | string[], { duration, value, }: {
    duration: number;
    value: BigNumber;
}): Promise<import("ethers").PopulatedTransaction>;
