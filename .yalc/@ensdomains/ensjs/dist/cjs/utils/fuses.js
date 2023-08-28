"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fuses_exports = {};
__export(fuses_exports, {
  CHILD_CONTROLLED_FUSES: () => CHILD_CONTROLLED_FUSES,
  PARENT_CONTROLLED_FUSES: () => PARENT_CONTROLLED_FUSES,
  USER_SETTABLE_FUSES: () => USER_SETTABLE_FUSES,
  checkPCCBurned: () => checkPCCBurned,
  childFuseEnum: () => childFuseEnum,
  childFuseKeys: () => childFuseKeys,
  decodeFuses: () => decodeFuses,
  default: () => fuses_default,
  encodeFuses: () => encodeFuses,
  fullFuseEnum: () => fullFuseEnum,
  fullParentFuseEnum: () => fullParentFuseEnum,
  fullParentFuseKeys: () => fullParentFuseKeys,
  hasFuses: () => hasFuses,
  parentFuseEnum: () => parentFuseEnum,
  parentFuseKeys: () => parentFuseKeys,
  unnamedChildFuses: () => unnamedChildFuses,
  unnamedParentFuses: () => unnamedParentFuses,
  unnamedUserSettableFuses: () => unnamedUserSettableFuses,
  userSettableFuseEnum: () => userSettableFuseEnum,
  userSettableFuseKeys: () => userSettableFuseKeys
});
module.exports = __toCommonJS(fuses_exports);
const CANNOT_UNWRAP = 1;
const CANNOT_BURN_FUSES = 2;
const CANNOT_TRANSFER = 4;
const CANNOT_SET_RESOLVER = 8;
const CANNOT_SET_TTL = 16;
const CANNOT_CREATE_SUBDOMAIN = 32;
const CANNOT_APPROVE = 64;
const PARENT_CANNOT_CONTROL = 65536;
const IS_DOT_ETH = 131072;
const CAN_EXTEND_EXPIRY = 262144;
const CHILD_CONTROLLED_FUSES = 65535;
const PARENT_CONTROLLED_FUSES = 4294901760;
const USER_SETTABLE_FUSES = 4294836223;
const CAN_DO_EVERYTHING = 0;
const childFuseEnum = {
  CANNOT_UNWRAP,
  CANNOT_BURN_FUSES,
  CANNOT_TRANSFER,
  CANNOT_SET_RESOLVER,
  CANNOT_SET_TTL,
  CANNOT_CREATE_SUBDOMAIN,
  CANNOT_APPROVE
};
const parentFuseEnum = {
  PARENT_CANNOT_CONTROL,
  CAN_EXTEND_EXPIRY
};
const fullParentFuseEnum = {
  ...parentFuseEnum,
  IS_DOT_ETH
};
const userSettableFuseEnum = {
  ...childFuseEnum,
  ...parentFuseEnum
};
const fullFuseEnum = {
  ...userSettableFuseEnum,
  ...fullParentFuseEnum,
  CAN_DO_EVERYTHING
};
const unnamedChildFuses = [
  128,
  256,
  512,
  1024,
  2048,
  4096,
  8192,
  16384,
  32768
];
const unnamedParentFuses = [
  524288,
  1048576,
  2097152,
  4194304,
  8388608,
  16777216,
  33554432,
  67108864,
  134217728,
  268435456,
  536870912,
  1073741824,
  2147483648
];
const unnamedUserSettableFuses = [
  ...unnamedChildFuses,
  ...unnamedParentFuses
];
const childFuseKeys = Object.keys(
  childFuseEnum
);
const parentFuseKeys = Object.keys(
  parentFuseEnum
);
const fullParentFuseKeys = Object.keys(
  fullParentFuseEnum
);
const userSettableFuseKeys = Object.keys(
  userSettableFuseEnum
);
const checkNumber = (fuses) => {
  if (fuses > 2 ** 32 || fuses < 1) {
    throw new Error(
      `Fuse number must be limited to uint32, ${fuses} was too ${fuses < 1 ? "low" : "high"}.`
    );
  } else if (fuses % 1 !== 0) {
    throw new Error(`Fuse number must be an integer, ${fuses} was not.`);
  } else if ((fuses & USER_SETTABLE_FUSES) !== fuses) {
    throw new Error(
      `Fuse number must be limited to user settable fuses, ${fuses} was not.`
    );
  }
};
const testFuses = (fuses) => {
  if ("named" in fuses && fuses.named.length > 0) {
    return true;
  }
  if ("unnamed" in fuses && fuses.unnamed.length > 0) {
    return true;
  }
  if ("number" in fuses && fuses.number !== 0) {
    return true;
  }
  return false;
};
const hasFuses = (fuses) => {
  if (typeof fuses === "number") {
    return fuses !== 0;
  }
  if (typeof fuses === "object") {
    if ("child" in fuses && testFuses(fuses.child)) {
      return true;
    }
    if ("parent" in fuses && testFuses(fuses.parent)) {
      return true;
    }
    if (testFuses(fuses)) {
      return true;
    }
  }
  return false;
};
function encodeFuses(fuses, restrictTo) {
  let encodedFuses = 0;
  if (typeof fuses === "number") {
    if (restrictTo) {
      throw new Error("Cannot specify an exact fuse value when restricted.");
    }
    checkNumber(fuses);
    encodedFuses = fuses;
  } else {
    let fusesRef = fuses;
    let allowedNamed = [];
    let allowedUnnamed = [];
    let namedArray = [];
    let unnamedArray = [];
    if (restrictTo) {
      if ("parent" in fuses || "child" in fuses) {
        throw new Error("Can't specify fuse category when restricted.");
      }
      allowedNamed = restrictTo === "child" ? childFuseKeys : parentFuseKeys;
      allowedUnnamed = restrictTo === "child" ? unnamedChildFuses : unnamedParentFuses;
      fusesRef = { [restrictTo]: fuses };
    } else {
      allowedNamed = userSettableFuseKeys;
      allowedUnnamed = unnamedUserSettableFuses;
    }
    if ("parent" in fusesRef) {
      if ("named" in fusesRef.parent)
        namedArray = fusesRef.parent.named;
      if ("unnamed" in fusesRef.parent)
        unnamedArray = fusesRef.parent.unnamed;
      if ("number" in fusesRef.parent) {
        if ("named" in fusesRef.parent || "unnamed" in fusesRef.parent) {
          throw new Error(
            "Cannot specify both a fuse number and named/unnamed fuses."
          );
        }
        checkNumber(fusesRef.parent.number);
        if ((fusesRef.parent.number & PARENT_CONTROLLED_FUSES) !== fusesRef.parent.number) {
          throw new Error(
            "Cannot specify a fuse value to set that is outside of the parent's control."
          );
        }
        encodedFuses |= fusesRef.parent.number;
      }
    }
    if ("child" in fusesRef) {
      if ("named" in fusesRef.child)
        namedArray = [...namedArray, ...fusesRef.child.named];
      if ("unnamed" in fusesRef.child)
        unnamedArray = [...unnamedArray, ...fusesRef.child.unnamed];
      if ("number" in fusesRef.child) {
        if ("named" in fusesRef.child || "unnamed" in fusesRef.child) {
          throw new Error(
            "Cannot specify both a fuse number and named/unnamed fuses."
          );
        }
        checkNumber(fusesRef.child.number);
        if ((fusesRef.child.number & CHILD_CONTROLLED_FUSES) !== fusesRef.child.number) {
          throw new Error(
            "Cannot specify a fuse value to set that is outside of the owner's control."
          );
        }
        encodedFuses |= fusesRef.child.number;
      }
    }
    if (!namedArray.length && !unnamedArray.length && !encodedFuses) {
      throw new Error("Must specify at least one fuse.");
    }
    for (const fuse of namedArray) {
      if (!allowedNamed.includes(fuse)) {
        if (!userSettableFuseKeys.includes(fuse)) {
          throw new Error(`${fuse} is not a valid named fuse.`);
        }
        throw new Error(`Fuse ${fuse} is not allowed for this operation.`);
      }
      encodedFuses |= userSettableFuseEnum[fuse];
    }
    for (const fuse of unnamedArray) {
      if (!allowedUnnamed.includes(fuse)) {
        if (!unnamedUserSettableFuses.includes(fuse)) {
          throw new Error(
            `${fuse} is not a valid unnamed fuse. If you are trying to set a named fuse, use the named property.`
          );
        }
        throw new Error(`Fuse ${fuse} is not allowed for this operation.`);
      }
      encodedFuses |= fuse;
    }
  }
  return encodedFuses;
}
const decodeNamedFuses = (fuses, arr) => {
  const fuseObj = Object.fromEntries(
    arr.map((fuse) => [
      fuse,
      (fuses & fullFuseEnum[fuse]) === fullFuseEnum[fuse]
    ])
  );
  return fuseObj;
};
const decodeUnnamedFuses = (fuses, arr) => {
  const fuseObj = Object.fromEntries(
    arr.map((fuse) => [fuse, (fuses & fuse) === fuse])
  );
  return fuseObj;
};
const decodeFuses = (fuses) => {
  const parentNamedFuses = decodeNamedFuses(
    fuses,
    fullParentFuseKeys
  );
  const parentUnnamedFuses = decodeUnnamedFuses(
    fuses,
    unnamedParentFuses
  );
  const childNamedFuses = decodeNamedFuses(
    fuses,
    childFuseKeys
  );
  const childUnnamedFuses = decodeUnnamedFuses(
    fuses,
    unnamedChildFuses
  );
  return {
    parent: {
      ...parentNamedFuses,
      unnamed: parentUnnamedFuses
    },
    child: {
      ...childNamedFuses,
      CAN_DO_EVERYTHING: (fuses & CHILD_CONTROLLED_FUSES) === 0,
      unnamed: childUnnamedFuses
    }
  };
};
const checkPCCBurned = (fuses) => (fuses & PARENT_CANNOT_CONTROL) === PARENT_CANNOT_CONTROL;
var fuses_default = fullFuseEnum;
