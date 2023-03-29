import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ENSArgs } from '..';
declare type BaseProps = {
    duration: number;
    value: BigNumber;
};
declare type WrappedProps = {
    duration: BigNumberish;
};
export declare function extendWrappedName({ contracts }: ENSArgs<'contracts'>, name: string, options?: WrappedProps): Promise<import("ethers").PopulatedTransaction>;
export default function ({ contracts }: ENSArgs<'contracts'>, nameOrNames: string | string[], { duration, value }: BaseProps): Promise<import("ethers").PopulatedTransaction>;
export {};
