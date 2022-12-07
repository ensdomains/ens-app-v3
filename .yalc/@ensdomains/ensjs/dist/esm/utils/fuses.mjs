// src/utils/fuses.ts
import { BigNumber } from "ethers";
var CANNOT_UNWRAP = 1;
var CANNOT_BURN_FUSES = 2;
var CANNOT_TRANSFER = 4;
var CANNOT_SET_RESOLVER = 8;
var CANNOT_SET_TTL = 16;
var CANNOT_CREATE_SUBDOMAIN = 32;
var PARENT_CANNOT_CONTROL = 64;
var CAN_DO_EVERYTHING = 0;
var fuseEnum = {
  CANNOT_UNWRAP,
  CANNOT_BURN_FUSES,
  CANNOT_TRANSFER,
  CANNOT_SET_RESOLVER,
  CANNOT_SET_TTL,
  CANNOT_CREATE_SUBDOMAIN,
  PARENT_CANNOT_CONTROL
};
var unnamedFuses = [
  128,
  256,
  512,
  1024,
  2048,
  4096,
  8192,
  16384,
  32768,
  65536,
  131072,
  262144,
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
  2147483648,
  4294967296
];
var fullFuseEnum = {
  ...fuseEnum,
  CAN_DO_EVERYTHING
};
var validateFuses = (fuses) => {
  const isNumber = "fuseNumberToBurn" in fuses;
  const hasNamedArray = "namedFusesToBurn" in fuses;
  const hasUnnamedArray = "unnamedFusesToBurn" in fuses;
  let encodedFuses = 0;
  if (isNumber) {
    if (fuses.fuseNumberToBurn > 2 ** 32 || fuses.fuseNumberToBurn < 1) {
      throw new Error(
        `Fuse number must be limited to uint32, ${fuses.fuseNumberToBurn} was too ${fuses.fuseNumberToBurn < 1 ? "low" : "high"}.`
      );
    } else if (fuses.fuseNumberToBurn % 1 !== 0) {
      throw new Error(
        `Fuse number must be an integer, ${fuses.fuseNumberToBurn} was not.`
      );
    }
    encodedFuses = fuses.fuseNumberToBurn;
  } else {
    if (!hasNamedArray && !hasUnnamedArray) {
      throw new Error("Please provide fuses to burn");
    }
    if (hasNamedArray) {
      for (const fuse of fuses.namedFusesToBurn) {
        if (!(fuse in fuseEnum)) {
          throw new Error(`${fuse} is not a valid named fuse.`);
        }
        encodedFuses |= fuseEnum[fuse];
      }
    }
    if (hasUnnamedArray) {
      for (const fuse of fuses.unnamedFusesToBurn) {
        if (!unnamedFuses.includes(fuse)) {
          throw new Error(
            `${fuse} is not a valid unnamed fuse. If you are trying to burn a named fuse, use the namedFusesToBurn property.`
          );
        }
        encodedFuses |= fuse;
      }
    }
  }
  return encodedFuses;
};
var decodeFuses = (fuses) => {
  const bnFuses = BigNumber.from(fuses);
  const fuseObj = Object.fromEntries(
    Object.keys(fuseEnum).map((fuse) => [
      fuse,
      bnFuses.and(fuseEnum[fuse]).gt(0)
    ])
  );
  if (bnFuses.eq(0)) {
    fuseObj.CAN_DO_EVERYTHING = true;
  } else {
    fuseObj.CAN_DO_EVERYTHING = false;
  }
  return fuseObj;
};
var fuses_default = fullFuseEnum;
export {
  decodeFuses,
  fuses_default as default,
  fuseEnum,
  unnamedFuses,
  validateFuses
};
