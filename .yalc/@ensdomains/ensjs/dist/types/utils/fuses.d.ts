export declare const CHILD_CONTROLLED_FUSES = 65535;
export declare const PARENT_CONTROLLED_FUSES = 4294901760;
export declare const USER_SETTABLE_FUSES = 4294836223;
export declare const childFuseEnum: {
    readonly CANNOT_UNWRAP: 1;
    readonly CANNOT_BURN_FUSES: 2;
    readonly CANNOT_TRANSFER: 4;
    readonly CANNOT_SET_RESOLVER: 8;
    readonly CANNOT_SET_TTL: 16;
    readonly CANNOT_CREATE_SUBDOMAIN: 32;
    readonly CANNOT_APPROVE: 64;
};
export declare const parentFuseEnum: {
    PARENT_CANNOT_CONTROL: number;
    CAN_EXTEND_EXPIRY: number;
};
export declare const fullParentFuseEnum: {
    readonly IS_DOT_ETH: 131072;
    readonly PARENT_CANNOT_CONTROL: number;
    readonly CAN_EXTEND_EXPIRY: number;
};
export declare const userSettableFuseEnum: {
    readonly PARENT_CANNOT_CONTROL: number;
    readonly CAN_EXTEND_EXPIRY: number;
    readonly CANNOT_UNWRAP: 1;
    readonly CANNOT_BURN_FUSES: 2;
    readonly CANNOT_TRANSFER: 4;
    readonly CANNOT_SET_RESOLVER: 8;
    readonly CANNOT_SET_TTL: 16;
    readonly CANNOT_CREATE_SUBDOMAIN: 32;
    readonly CANNOT_APPROVE: 64;
};
export declare const fullFuseEnum: {
    CAN_DO_EVERYTHING: number;
    IS_DOT_ETH: 131072;
    PARENT_CANNOT_CONTROL: number;
    CAN_EXTEND_EXPIRY: number;
    CANNOT_UNWRAP: 1;
    CANNOT_BURN_FUSES: 2;
    CANNOT_TRANSFER: 4;
    CANNOT_SET_RESOLVER: 8;
    CANNOT_SET_TTL: 16;
    CANNOT_CREATE_SUBDOMAIN: 32;
    CANNOT_APPROVE: 64;
};
export declare const unnamedChildFuses: readonly [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
export declare const unnamedParentFuses: readonly [524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648];
export declare const unnamedUserSettableFuses: readonly [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648];
export declare const childFuseKeys: ("CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE")[];
export declare const parentFuseKeys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY")[];
export declare const fullParentFuseKeys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY" | "IS_DOT_ETH")[];
export declare const userSettableFuseKeys: ("CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE" | "PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY")[];
declare type FuseType<Enum extends Record<string, number>, UnnamedTuple extends readonly number[], CustomFuses extends string = never> = {
    fuse: keyof Enum;
    options: {
        -readonly [K in keyof Enum]?: boolean;
    };
    current: {
        [K in keyof Enum]: boolean;
    } & {
        readonly [K in CustomFuses]: boolean;
    };
    unnamed: UnnamedTuple;
    unnamedValues: UnnamedTuple[number];
    unnamedObject: {
        [K in UnnamedTuple[number]]: boolean;
    };
};
export declare type ChildFuses = FuseType<typeof childFuseEnum, typeof unnamedChildFuses, 'CAN_DO_EVERYTHING'>;
export declare type ParentFuses = FuseType<typeof parentFuseEnum, typeof unnamedParentFuses>;
export declare type FullParentFuses = FuseType<typeof fullParentFuseEnum, typeof unnamedParentFuses>;
export declare type UserSettableFuses = FuseType<typeof userSettableFuseEnum, typeof unnamedUserSettableFuses>;
declare type InputFuses<NamedFuse extends string, UnnamedFuse extends number> = {
    named: readonly NamedFuse[];
} | {
    unnamed: readonly UnnamedFuse[];
} | {
    named: readonly NamedFuse[];
    unnamed: readonly UnnamedFuse[];
} | {
    number: number;
};
export declare type CombinedFuseInput = {
    child: InputFuses<ChildFuses['fuse'], ChildFuses['unnamedValues']>;
    parent: InputFuses<ParentFuses['fuse'], ParentFuses['unnamedValues']>;
};
export declare const hasFuses: (fuses: any) => boolean;
export declare function encodeFuses(fuses: Partial<CombinedFuseInput> | number): number;
export declare function encodeFuses(fuses: CombinedFuseInput['child'], restrictTo: 'child'): number;
export declare function encodeFuses(fuses: CombinedFuseInput['parent'], restrictTo: 'parent'): number;
export declare const decodeFuses: (fuses: number) => {
    parent: {
        unnamed: {
            524288: boolean;
            1048576: boolean;
            2097152: boolean;
            4194304: boolean;
            8388608: boolean;
            16777216: boolean;
            33554432: boolean;
            67108864: boolean;
            134217728: boolean;
            268435456: boolean;
            536870912: boolean;
            1073741824: boolean;
            2147483648: boolean;
        };
        IS_DOT_ETH: boolean;
        PARENT_CANNOT_CONTROL: boolean;
        CAN_EXTEND_EXPIRY: boolean;
    };
    child: {
        CAN_DO_EVERYTHING: boolean;
        unnamed: {
            1024: boolean;
            128: boolean;
            256: boolean;
            512: boolean;
            2048: boolean;
            4096: boolean;
            8192: boolean;
            16384: boolean;
            32768: boolean;
        };
        CANNOT_UNWRAP: boolean;
        CANNOT_BURN_FUSES: boolean;
        CANNOT_TRANSFER: boolean;
        CANNOT_SET_RESOLVER: boolean;
        CANNOT_SET_TTL: boolean;
        CANNOT_CREATE_SUBDOMAIN: boolean;
        CANNOT_APPROVE: boolean;
    };
};
export declare const checkPCCBurned: (fuses: number) => boolean;
export declare type AllCurrentFuses = ReturnType<typeof decodeFuses>;
export default fullFuseEnum;
