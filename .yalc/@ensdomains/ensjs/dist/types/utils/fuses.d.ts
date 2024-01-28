export declare const ChildFuses: {
    readonly CANNOT_UNWRAP: 1n;
    readonly CANNOT_BURN_FUSES: 2n;
    readonly CANNOT_TRANSFER: 4n;
    readonly CANNOT_SET_RESOLVER: 8n;
    readonly CANNOT_SET_TTL: 16n;
    readonly CANNOT_CREATE_SUBDOMAIN: 32n;
    readonly CANNOT_APPROVE: 64n;
};
export type ChildFuses = typeof ChildFuses;
export declare const ChildFuseKeys: ("CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE")[];
export declare const ParentFuses: {
    readonly PARENT_CANNOT_CONTROL: 65536n;
    readonly CAN_EXTEND_EXPIRY: 262144n;
};
export type ParentFuses = typeof ParentFuses;
export declare const ParentFuseKeys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY")[];
export declare const UserSettableFuses: {
    readonly PARENT_CANNOT_CONTROL: 65536n;
    readonly CAN_EXTEND_EXPIRY: 262144n;
    readonly CANNOT_UNWRAP: 1n;
    readonly CANNOT_BURN_FUSES: 2n;
    readonly CANNOT_TRANSFER: 4n;
    readonly CANNOT_SET_RESOLVER: 8n;
    readonly CANNOT_SET_TTL: 16n;
    readonly CANNOT_CREATE_SUBDOMAIN: 32n;
    readonly CANNOT_APPROVE: 64n;
};
export type UserSettableFuses = typeof UserSettableFuses;
export declare const UserSettableFuseKeys: ("CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE" | "PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY")[];
export declare const FullParentFuses: {
    readonly IS_DOT_ETH: 131072n;
    readonly PARENT_CANNOT_CONTROL: 65536n;
    readonly CAN_EXTEND_EXPIRY: 262144n;
};
export type FullParentFuses = typeof FullParentFuses;
export declare const FullParentFuseKeys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY" | "IS_DOT_ETH")[];
export declare const UnnamedChildFuses: readonly [128n, 256n, 512n, 1024n, 2048n, 4096n, 8192n, 16384n, 32768n];
export type UnnamedChildFuses = typeof UnnamedChildFuses;
export declare const UnnamedChildFuseKeys: readonly ["0x80", "0x100", "0x200", "0x400", "0x800", "0x1000", "0x2000", "0x4000", "0x8000"];
export type UnnamedChildFuseKeys = typeof UnnamedChildFuseKeys;
export declare const UnnamedParentFuses: readonly [524288n, 1048576n, 2097152n, 4194304n, 8388608n, 16777216n, 33554432n, 67108864n, 134217728n, 268435456n, 536870912n, 1073741824n, 2147483648n];
export type UnnamedParentFuses = typeof UnnamedParentFuses;
export declare const UnnamedParentFuseKeys: readonly ["0x80000", "0x100000", "0x200000", "0x400000", "0x800000", "0x1000000"];
export type UnnamedParentFuseKeys = typeof UnnamedParentFuseKeys;
export declare const FuseRanges: {
    readonly CHILD_CONTROLLED_FUSES: 65535n;
    readonly PARENT_CONTROLLED_FUSES: 4294901760n;
    readonly USER_SETTABLE_FUSES: 4294836223n;
};
type FuseRestriction = 'parent' | 'child';
type GenericFuseEnum<TGroupName extends FuseRestriction = FuseRestriction> = {
    Name: TGroupName;
    Object: Record<string, bigint>;
    Keys: string[];
    Range: bigint;
    Unnamed: readonly bigint[];
    UnnamedKeys: readonly string[];
    Minimum: bigint;
    Maximum: bigint;
};
export declare const ChildFuseReference: {
    readonly Name: "child";
    readonly Object: {
        readonly CANNOT_UNWRAP: 1n;
        readonly CANNOT_BURN_FUSES: 2n;
        readonly CANNOT_TRANSFER: 4n;
        readonly CANNOT_SET_RESOLVER: 8n;
        readonly CANNOT_SET_TTL: 16n;
        readonly CANNOT_CREATE_SUBDOMAIN: 32n;
        readonly CANNOT_APPROVE: 64n;
    };
    readonly Keys: ("CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE")[];
    readonly Range: 65535n;
    readonly Unnamed: readonly [128n, 256n, 512n, 1024n, 2048n, 4096n, 8192n, 16384n, 32768n];
    readonly UnnamedKeys: readonly ["0x80", "0x100", "0x200", "0x400", "0x800", "0x1000", "0x2000", "0x4000", "0x8000"];
    readonly Minimum: 0n;
    readonly Maximum: bigint;
};
export type ChildFuseReferenceType = typeof ChildFuseReference & {
    Key: keyof ChildFuseReferenceType['Object'];
    UnnamedKey: ChildFuseReferenceType['Unnamed'][number];
};
export declare const ParentFuseReference: {
    readonly Name: "parent";
    readonly Object: {
        readonly PARENT_CANNOT_CONTROL: 65536n;
        readonly CAN_EXTEND_EXPIRY: 262144n;
    };
    readonly Keys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY")[];
    readonly Range: 4294901760n;
    readonly Unnamed: readonly [524288n, 1048576n, 2097152n, 4194304n, 8388608n, 16777216n, 33554432n, 67108864n, 134217728n, 268435456n, 536870912n, 1073741824n, 2147483648n];
    readonly UnnamedKeys: readonly ["0x80000", "0x100000", "0x200000", "0x400000", "0x800000", "0x1000000"];
    readonly Minimum: bigint;
    readonly Maximum: bigint;
};
export type ParentFuseReferenceType = typeof ParentFuseReference & {
    Key: keyof ParentFuseReferenceType['Object'];
    UnnamedKey: ParentFuseReferenceType['Unnamed'][number];
};
export declare const FullParentFuseReference: {
    readonly Name: "parent";
    readonly Object: {
        readonly IS_DOT_ETH: 131072n;
        readonly PARENT_CANNOT_CONTROL: 65536n;
        readonly CAN_EXTEND_EXPIRY: 262144n;
    };
    readonly Keys: ("PARENT_CANNOT_CONTROL" | "CAN_EXTEND_EXPIRY" | "IS_DOT_ETH")[];
    readonly Range: 4294901760n;
    readonly Unnamed: readonly [524288n, 1048576n, 2097152n, 4194304n, 8388608n, 16777216n, 33554432n, 67108864n, 134217728n, 268435456n, 536870912n, 1073741824n, 2147483648n];
    readonly UnnamedKeys: readonly ["0x80000", "0x100000", "0x200000", "0x400000", "0x800000", "0x1000000"];
    readonly Minimum: bigint;
    readonly Maximum: bigint;
};
export type FullParentFuseReferenceType = typeof FullParentFuseReference & {
    Key: keyof FullParentFuseReferenceType['Object'];
    UnnamedKey: ParentFuseReferenceType['Unnamed'][number];
};
type InputFuses<NamedFuse extends string, UnnamedFuse extends bigint> = {
    named: readonly NamedFuse[];
    unnamed?: readonly UnnamedFuse[];
    number?: never;
} | {
    named?: readonly NamedFuse[];
    unnamed: readonly UnnamedFuse[];
    number?: never;
} | {
    named?: never;
    unnamed?: never;
    number: bigint;
};
export type EncodeChildFusesInputObject = InputFuses<ChildFuseReferenceType['Key'], ChildFuseReferenceType['UnnamedKey']>;
export type EncodeParentFusesInputObject = InputFuses<ParentFuseReferenceType['Key'], ParentFuseReferenceType['UnnamedKey']>;
export type EncodeFusesInputObject = {
    child: EncodeChildFusesInputObject;
    parent?: EncodeParentFusesInputObject;
    number?: never;
} | {
    child?: EncodeChildFusesInputObject;
    parent: EncodeParentFusesInputObject;
    number?: never;
} | {
    child?: never;
    parent?: never;
    number: bigint;
};
type EncodeFusesParameters = {
    restriction: 'child';
    input: EncodeChildFusesInputObject;
} | {
    restriction: 'parent';
    input: EncodeParentFusesInputObject;
} | {
    restriction?: never;
    input: EncodeFusesInputObject;
};
export declare const encodeFuses: ({ restriction, input, }: EncodeFusesParameters) => number;
type DecodedFuseGroup<TFuseReference extends GenericFuseEnum> = {
    [key in TFuseReference['Keys'][number]]: boolean;
} & {
    unnamed: {
        [key in TFuseReference['UnnamedKeys'][number]]: boolean;
    };
};
type DecodedChildFuses = DecodedFuseGroup<ChildFuseReferenceType> & {
    CAN_DO_EVERYTHING: boolean;
};
type DecodedParentFuses = DecodedFuseGroup<FullParentFuseReferenceType>;
export type DecodedFuses = {
    child: DecodedChildFuses;
    parent: DecodedParentFuses;
};
export declare const decodeFuses: (fuses: number) => DecodedFuses;
export declare const checkPccBurned: (fuses: bigint) => boolean;
export {};
//# sourceMappingURL=fuses.d.ts.map