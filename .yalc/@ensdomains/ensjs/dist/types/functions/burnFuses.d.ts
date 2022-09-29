import { ENSArgs } from '..';
import { NamedFusesToBurn, UnnamedFuseValues } from '../utils/fuses';
export declare type FusePropsNamedArray = {
    namedFusesToBurn: NamedFusesToBurn;
};
export declare type FusePropsUnnamedArray = {
    unnamedFusesToBurn: UnnamedFuseValues[];
};
export declare type FusePropsNumber = {
    fuseNumberToBurn: number;
};
export declare type FuseProps = (Partial<FusePropsNamedArray> & FusePropsUnnamedArray) | (FusePropsNamedArray & Partial<FusePropsUnnamedArray>) | FusePropsNumber;
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, props: FuseProps): Promise<import("ethers").PopulatedTransaction>;
