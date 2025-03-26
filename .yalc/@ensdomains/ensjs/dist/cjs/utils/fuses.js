"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPccBurned = exports.decodeFuses = exports.encodeFuses = exports.FullParentFuseReference = exports.ParentFuseReference = exports.ChildFuseReference = exports.FuseRanges = exports.UnnamedParentFuseKeys = exports.UnnamedParentFuses = exports.UnnamedChildFuseKeys = exports.UnnamedChildFuses = exports.FullParentFuseKeys = exports.FullParentFuses = exports.UserSettableFuseKeys = exports.UserSettableFuses = exports.ParentFuseKeys = exports.ParentFuses = exports.ChildFuseKeys = exports.ChildFuses = void 0;
const utils_js_1 = require("../errors/utils.js");
exports.ChildFuses = {
    CANNOT_UNWRAP: 1n,
    CANNOT_BURN_FUSES: 2n,
    CANNOT_TRANSFER: 4n,
    CANNOT_SET_RESOLVER: 8n,
    CANNOT_SET_TTL: 16n,
    CANNOT_CREATE_SUBDOMAIN: 32n,
    CANNOT_APPROVE: 64n,
};
exports.ChildFuseKeys = Object.keys(exports.ChildFuses);
exports.ParentFuses = {
    PARENT_CANNOT_CONTROL: 0x10000n,
    CAN_EXTEND_EXPIRY: 0x40000n,
};
exports.ParentFuseKeys = Object.keys(exports.ParentFuses);
exports.UserSettableFuses = {
    ...exports.ChildFuses,
    ...exports.ParentFuses,
};
exports.UserSettableFuseKeys = Object.keys(exports.UserSettableFuses);
exports.FullParentFuses = {
    ...exports.ParentFuses,
    IS_DOT_ETH: 0x20000n,
};
exports.FullParentFuseKeys = Object.keys(exports.FullParentFuses);
exports.UnnamedChildFuses = [
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
exports.UnnamedChildFuseKeys = [
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
exports.UnnamedParentFuses = [
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
exports.UnnamedParentFuseKeys = [
    '0x80000',
    '0x100000',
    '0x200000',
    '0x400000',
    '0x800000',
    '0x1000000',
];
exports.FuseRanges = {
    CHILD_CONTROLLED_FUSES: 0x0000ffffn,
    PARENT_CONTROLLED_FUSES: 0xffff0000n,
    USER_SETTABLE_FUSES: 0xfffdffffn,
};
exports.ChildFuseReference = {
    Name: 'child',
    Object: exports.ChildFuses,
    Keys: exports.ChildFuseKeys,
    Range: exports.FuseRanges.CHILD_CONTROLLED_FUSES,
    Unnamed: exports.UnnamedChildFuses,
    UnnamedKeys: exports.UnnamedChildFuseKeys,
    Minimum: 0n,
    Maximum: 2n ** 16n - 1n,
};
exports.ParentFuseReference = {
    Name: 'parent',
    Object: exports.ParentFuses,
    Keys: exports.ParentFuseKeys,
    Range: exports.FuseRanges.PARENT_CONTROLLED_FUSES,
    Unnamed: exports.UnnamedParentFuses,
    UnnamedKeys: exports.UnnamedParentFuseKeys,
    Minimum: 2n ** 16n,
    Maximum: 2n ** 32n,
};
exports.FullParentFuseReference = {
    Name: 'parent',
    Object: exports.FullParentFuses,
    Keys: exports.FullParentFuseKeys,
    Range: exports.FuseRanges.PARENT_CONTROLLED_FUSES,
    Unnamed: exports.UnnamedParentFuses,
    UnnamedKeys: exports.UnnamedParentFuseKeys,
    Minimum: 2n ** 16n,
    Maximum: 2n ** 32n,
};
const validateFuseNumber = (fuses) => {
    if (fuses > 2n ** 32n || fuses < 0n)
        throw new utils_js_1.FusesOutOfRangeError({
            fuses,
            details: `Fuse number must be limited to uint32, the supplied value was too ${fuses < 0 ? 'low' : 'high'}`,
        });
    else if ((fuses & exports.FuseRanges.USER_SETTABLE_FUSES) !== fuses)
        throw new utils_js_1.FusesOutOfRangeError({
            fuses,
            details: `Fuse number must be limited to user settable fuses, the supplied value was not`,
        });
};
const checkFuseObject = ({ reference, object, }) => {
    if (!object)
        return 0;
    if ('number' in object) {
        if ('named' in object || 'unnamed' in object)
            throw new utils_js_1.FusesInvalidFuseObjectError({
                fuses: object,
                details: 'Cannot specify both a fuse number and named/unnamed fuses.',
            });
        validateFuseNumber(object.number);
        if ((object.number & reference.Range) !== object.number)
            throw new utils_js_1.FusesOutOfRangeError({
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
                throw new utils_js_1.FusesInvalidNamedFuseError({ fuse });
            fuseNumber |= reference.Object[fuse];
        }
    }
    if ('unnamed' in object && object.unnamed) {
        for (const fuse of object.unnamed) {
            if (!reference.Unnamed.includes(fuse))
                throw new utils_js_1.FusesInvalidUnnamedFuseError({ fuse });
            fuseNumber |= fuse;
        }
    }
    return Number(fuseNumber);
};
const encodeFuses = ({ restriction, input, }) => {
    if (restriction) {
        if ('parent' in input || 'child' in input)
            throw new utils_js_1.FusesRestrictionNotAllowedError({
                fuses: input,
                details: 'Fuse restriction cannot be used when fuse category is specified',
            });
        return checkFuseObject({
            object: input,
            reference: restriction === 'child' ? exports.ChildFuseReference : exports.ParentFuseReference,
        });
    }
    if ('number' in input) {
        if ('parent' in input || 'child' in input)
            throw new utils_js_1.FusesInvalidFuseObjectError({
                fuses: input,
                details: 'Cannot specify both a fuse number and named/unnamed fuses.',
            });
        validateFuseNumber(input.number);
        return Number(input.number);
    }
    const childFuses = 'child' in input
        ? checkFuseObject({ object: input.child, reference: exports.ChildFuseReference })
        : 0;
    const parentFuses = 'parent' in input
        ? checkFuseObject({
            object: input.parent,
            reference: exports.ParentFuseReference,
        })
        : 0;
    return Number(childFuses | parentFuses);
};
exports.encodeFuses = encodeFuses;
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
const decodeFuses = (fuses) => {
    const fusesBigInt = BigInt(fuses);
    return {
        parent: decodeFusesFromReference({
            input: fusesBigInt,
            reference: exports.FullParentFuseReference,
        }),
        child: {
            ...decodeFusesFromReference({
                input: fusesBigInt,
                reference: exports.ChildFuseReference,
            }),
            CAN_DO_EVERYTHING: (fusesBigInt & exports.FuseRanges.CHILD_CONTROLLED_FUSES) === 0n,
        },
    };
};
exports.decodeFuses = decodeFuses;
const checkPccBurned = (fuses) => (fuses & exports.ParentFuses.PARENT_CANNOT_CONTROL) === 0n;
exports.checkPccBurned = checkPccBurned;
//# sourceMappingURL=fuses.js.map