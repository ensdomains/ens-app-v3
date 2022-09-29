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
var burnFuses_exports = {};
__export(burnFuses_exports, {
  default: () => burnFuses_default
});
module.exports = __toCommonJS(burnFuses_exports);
var import_fuses = require("../utils/fuses");
var import_normalise = require("../utils/normalise");
async function burnFuses_default({ contracts, signer }, name, props) {
  const isNumber = "fuseNumberToBurn" in props;
  const hasNamedArray = "namedFusesToBurn" in props;
  const hasUnnamedArray = "unnamedFusesToBurn" in props;
  let encodedFuses = 0;
  if (isNumber) {
    if (props.fuseNumberToBurn > 2 ** 32 || props.fuseNumberToBurn < 1) {
      throw new Error(
        `Fuse number must be limited to uint32, ${props.fuseNumberToBurn} was too ${props.fuseNumberToBurn < 1 ? "low" : "high"}.`
      );
    } else if (props.fuseNumberToBurn % 1 !== 0) {
      throw new Error(
        `Fuse number must be an integer, ${props.fuseNumberToBurn} was not.`
      );
    }
    encodedFuses = props.fuseNumberToBurn;
  } else {
    if (!hasNamedArray && !hasUnnamedArray) {
      throw new Error("Please provide fuses to burn");
    }
    if (hasNamedArray) {
      for (const fuse of props.namedFusesToBurn) {
        if (!(fuse in import_fuses.fuseEnum)) {
          throw new Error(`${fuse} is not a valid named fuse.`);
        }
        encodedFuses |= import_fuses.fuseEnum[fuse];
      }
    }
    if (hasUnnamedArray) {
      for (const fuse of props.unnamedFusesToBurn) {
        if (!import_fuses.unnamedFuses.includes(fuse)) {
          throw new Error(
            `${fuse} is not a valid unnamed fuse. If you are trying to burn a named fuse, use the namedFusesToBurn property.`
          );
        }
        encodedFuses |= fuse;
      }
    }
  }
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const hash = (0, import_normalise.namehash)(name);
  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
