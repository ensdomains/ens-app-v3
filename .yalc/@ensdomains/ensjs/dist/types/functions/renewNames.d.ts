import { BigNumber, BigNumberish } from 'ethers';
import { ENSArgs } from '..';
import { FuseProps } from '../utils/fuses';
declare type BaseProps = {
    duration: number;
    value: BigNumber;
};
export declare function renewNameWithData({ contracts }: ENSArgs<'contracts'>, name: string, { duration, value, fuses, wrapperExpiry, }: BaseProps & {
    fuses?: FuseProps;
    wrapperExpiry?: BigNumberish;
}): Promise<import("ethers").PopulatedTransaction>;
export default function ({ contracts }: ENSArgs<'contracts'>, nameOrNames: string | string[], { duration, value }: BaseProps): Promise<import("ethers").PopulatedTransaction>;
export {};
