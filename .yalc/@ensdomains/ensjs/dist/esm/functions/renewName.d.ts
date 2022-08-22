import type { BigNumber } from 'ethers';
import { ENSArgs } from '..';
export default function ({ contracts }: ENSArgs<'contracts'>, name: string, { duration, value, }: {
    duration: number;
    value: BigNumber;
}): Promise<import("ethers").PopulatedTransaction>;
