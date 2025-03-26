/* eslint-disable @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention  */
import { FusesInvalidFuseObjectError, FusesInvalidNamedFuseError, FusesInvalidUnnamedFuseError, FusesOutOfRangeError, FusesRestrictionNotAllowedError, } from '../errors/utils.js';
export const ChildFuses = {
    CANNOT_UNWRAP: 1n,
    CANNOT_BURN_FUSES: 2n,
    CANNOT_TRANSFER: 4n,
    CANNOT_SET_RESOLVER: 8n,
    CANNOT_SET_TTL: 16n,
    CANNOT_CREATE_SUBDOMAIN: 32n,
    CANNOT_APPROVE: 64n,
};
export const ChildFuseKeys = Object.keys(ChildFuses);
export const ParentFuses = {
    PARENT_CANNOT_CONTROL: 0x10000n,
    CAN_EXTEND_EXPIRY: 0x40000n,
};
export const ParentFuseKeys = Object.keys(ParentFuses);
export const UserSettableFuses = {
    ...ChildFuses,
    ...ParentFuses,
};
export const UserSettableFuseKeys = Object.keys(UserSettableFuses);
export const FullParentFuses = {
    ...ParentFuses,
    IS_DOT_ETH: 0x20000n,
};
export const FullParentFuseKeys = Object.keys(FullParentFuses);
export const UnnamedChildFuses = [
    0x80n,
    0x100n,
    0x200n,
    0x400n,
    0x800n,
    0x1000n,
    0x2000n,
    0x4000n,
    0x8000n,
];
export const UnnamedChildFuseKeys = [
    '0x80',
    '0x100',
    '0x200',
    '0x400',
    '0x800',
    '0x1000',
    '0x2000',
    '0x4000',
    '0x8000',
];
export const UnnamedParentFuses = [
    0x80000n,
    0x100000n,
    0x200000n,
    0x400000n,
    0x800000n,
    0x1000000n,
    0x2000000n,
    0x4000000n,
    0x8000000n,
    0x10000000n,
    0x20000000n,
    0x40000000n,
    0x80000000n,
];
export const UnnamedParentFuseKeys = [
    '0x80000',
    '0x100000',
    '0x200000',
    '0x400000',
    '0x800000',
    '0x1000000',
];
export const FuseRanges = {
    CHILD_CONTROLLED_FUSES: 0x0000ffffn,
    PARENT_CONTROLLED_FUSES: 0xffff0000n,
    USER_SETTABLE_FUSES: 0xfffdffffn,
};
export const ChildFuseReference = {
    Name: 'child',
    Object: ChildFuses,
    Keys: ChildFuseKeys,
    Range: FuseRanges.CHILD_CONTROLLED_FUSES,
    Unnamed: UnnamedChildFuses,
    UnnamedKeys: UnnamedChildFuseKeys,
    Minimum: 0n,
    Maximum: 2n ** 16n - 1n,
};
export const ParentFuseReference = {
    Name: 'parent',
    Object: ParentFuses,
    Keys: ParentFuseKeys,
    Range: FuseRanges.PARENT_CONTROLLED_FUSES,
    Unnamed: UnnamedParentFuses,
    UnnamedKeys: UnnamedParentFuseKeys,
    Minimum: 2n ** 16n,
    Maximum: 2n ** 32n,
};
export const FullParentFuseReference = {
    Name: 'parent',
    Object: FullParentFuses,
    Keys: FullParentFuseKeys,
    Range: FuseRanges.PARENT_CONTROLLED_FUSES,
    Unnamed: UnnamedParentFuses,
    UnnamedKeys: UnnamedParentFuseKeys,
    Minimum: 2n ** 16n,
    Maximum: 2n ** 32n,
};
const validateFuseNumber = (fuses) => {
    if (fuses > 2n ** 32n || fuses < 0n)
        throw new FusesOutOfRangeError({
            fuses,
            details: `Fuse number must be limited to uint32, the supplied value was too ${fuses < 0 ? 'low' : 'high'}`,
        });
    else if ((fuses & FuseRanges.USER_SETTABLE_FUSES) !== fuses)
        throw new FusesOutOfRangeError({
            fuses,
            details: `Fuse number must be limited to user settable fuses, the supplied value was not`,
        });
};
const checkFuseObject = ({ reference, object, }) => {
    if (!object)
        return 0;
    if ('number' in object) {
        if ('named' in object || 'unnamed' in object)
            throw new FusesInvalidFuseObjectError({
                fuses: object,
                details: 'Cannot specify both a fuse number and named/unnamed fuses.',
            });
        validateFuseNumber(object.number);
        if ((object.number & reference.Range) !== object.number)
            throw new FusesOutOfRangeError({
                fuses: object.number,
                minimum: reference.Minimum,
                maximum: reference.Maximum,
                details: `Cannot specify a fuse value to set that is outside of the ${reference.Name}'s control.`,
            });
        return Number(object.number);
    }
    let fuseNumber = 0n;
    if ('named' in object && object.named) {
        for (const fuse of object.named) {
            if (!reference.Keys.includes(fuse))
                throw new FusesInvalidNamedFuseError({ fuse });
            fuseNumber |= reference.Object[fuse];
        }
    }
    if ('unnamed' in object && object.unnamed) {
        for (const fuse of object.unnamed) {
            if (!reference.Unnamed.includes(fuse))
                throw new FusesInvalidUnnamedFuseError({ fuse });
            fuseNumber |= fuse;
        }
    }
    return Number(fuseNumber);
};
export const encodeFuses = ({ restriction, input, }) => {
    if (restriction) {
        if ('parent' in input || 'child' in input)
            throw new FusesRestrictionNotAllowedError({
                fuses: input,
                details: 'Fuse restriction cannot be used when fuse category is specified',
            });
        return checkFuseObject({
            object: input,
            reference: restriction === 'child' ? ChildFuseReference : ParentFuseReference,
        });
    }
    if ('number' in input) {
        if ('parent' in input || 'child' in input)
            throw new FusesInvalidFuseObjectError({
                fuses: input,
                details: 'Cannot specify both a fuse number and named/unnamed fuses.',
            });
        validateFuseNumber(input.number);
        return Number(input.number);
    }
    const childFuses = 'child' in input
        ? checkFuseObject({ object: input.child, reference: ChildFuseReference })
        : 0;
    const parentFuses = 'parent' in input
        ? checkFuseObject({
            object: input.parent,
            reference: ParentFuseReference,
        })
        : 0;
    return Number(childFuses | parentFuses);
};
const decodeFusesFromReference = ({ input, reference, }) => ({
    ...Object.fromEntries(reference.Keys.map((key) => [
        key,
        (input & reference.Object[key]) === reference.Object[key],
    ])),
    unnamed: Object.fromEntries(reference.UnnamedKeys.map((key) => [
        key,
        (input & BigInt(key)) === BigInt(key),
    ])),
});
export const decodeFuses = (fuses) => {
    const fusesBigInt = BigInt(fuses);
    return {
        parent: decodeFusesFromReference({
            input: fusesBigInt,
            reference: FullParentFuseReference,
        }),
        child: {
            ...decodeFusesFromReference({
                input: fusesBigInt,
                reference: ChildFuseReference,
            }),
            CAN_DO_EVERYTHING: (fusesBigInt & FuseRanges.CHILD_CONTROLLED_FUSES) === 0n,
        },
    };
};
export const checkPccBurned = (fuses) => (fuses & ParentFuses.PARENT_CANNOT_CONTROL) === 0n;
//# sourceMappingURL=fuses.js.map