import { ENSArgs } from '..';
import { fuseEnum, unnamedFuses } from '../utils/fuses';
declare type FuseObj = typeof fuseEnum;
declare type UnnamedFuseType = typeof unnamedFuses;
declare type Fuse = keyof FuseObj;
declare type UnnamedFuseValues = UnnamedFuseType[number];
declare type FuseArrayPossibilities = [Fuse] | [Fuse, Fuse] | [Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse, Fuse];
/**
 * This type creates a type error if there are any duplicate fuses.
 * It effectively works like a reduce function, starting with 0 included types, adding a type each time, and then checking for duplicates.
 *
 * @template A The array to check for duplicates.
 * @template B The union of all checked existing types.
 */
declare type FusesWithoutDuplicates<A, B = never> = A extends FuseArrayPossibilities ? A extends [infer Head, ...infer Tail] ? Head extends B ? [
] : [
    Head,
    ...FusesWithoutDuplicates<Tail, Head | B>
] : A : [
];
declare type FusePropsNamedArray<A extends FuseArrayPossibilities> = {
    namedFusesToBurn: FusesWithoutDuplicates<A>;
};
declare type FusePropsUnnamedArray = {
    unnamedFusesToBurn: UnnamedFuseValues[];
};
declare type FusePropsNumber = {
    fuseNumberToBurn: number;
};
declare type FuseProps<A extends FuseArrayPossibilities> = (Partial<FusePropsNamedArray<A>> & FusePropsUnnamedArray) | (FusePropsNamedArray<A> & Partial<FusePropsUnnamedArray>) | FusePropsNumber;
export default function <A extends FuseArrayPossibilities>({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, props: FuseProps<A>): Promise<import("ethers").PopulatedTransaction>;
export {};
