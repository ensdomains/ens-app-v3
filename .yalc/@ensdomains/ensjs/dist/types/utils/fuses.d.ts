import { BigNumberish } from 'ethers';
export declare const fuseEnum: {
    readonly CANNOT_UNWRAP: 1;
    readonly CANNOT_BURN_FUSES: 2;
    readonly CANNOT_TRANSFER: 4;
    readonly CANNOT_SET_RESOLVER: 8;
    readonly CANNOT_SET_TTL: 16;
    readonly CANNOT_CREATE_SUBDOMAIN: 32;
    readonly PARENT_CANNOT_CONTROL: 64;
};
export declare type FuseOptions = {
    -readonly [K in keyof typeof fuseEnum]?: boolean;
};
export declare const unnamedFuses: readonly [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296];
declare const fullFuseEnum: {
    CAN_DO_EVERYTHING: number;
    CANNOT_UNWRAP: 1;
    CANNOT_BURN_FUSES: 2;
    CANNOT_TRANSFER: 4;
    CANNOT_SET_RESOLVER: 8;
    CANNOT_SET_TTL: 16;
    CANNOT_CREATE_SUBDOMAIN: 32;
    PARENT_CANNOT_CONTROL: 64;
};
export declare type FuseObj = typeof fuseEnum;
export declare type CurrentFuses = {
    [f in keyof FuseObj]: boolean;
} & {
    CAN_DO_EVERYTHING: boolean;
};
export declare type UnnamedFuseType = typeof unnamedFuses;
export declare type Fuse = keyof FuseObj;
export declare type UnnamedFuseValues = UnnamedFuseType[number];
export declare type FuseArrayPossibilities = [Fuse] | [Fuse, Fuse] | [Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse] | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse, Fuse];
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
export declare type NamedFusesToBurn = FusesWithoutDuplicates<FuseArrayPossibilities>;
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
export declare const validateFuses: (fuses: FuseProps) => number;
export declare const decodeFuses: (fuses: BigNumberish) => CurrentFuses;
export default fullFuseEnum;
