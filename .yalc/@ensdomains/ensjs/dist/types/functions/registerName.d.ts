import { BigNumber } from '@ethersproject/bignumber';
import { ENSArgs } from '..';
import { BaseRegistrationParams } from '../utils/registerHelpers';
declare type Params = BaseRegistrationParams & {
    value: BigNumber;
};
export default function ({ contracts }: ENSArgs<'contracts'>, name: string, { resolverAddress, value, ...params }: Params): Promise<import("ethers").PopulatedTransaction>;
export {};
