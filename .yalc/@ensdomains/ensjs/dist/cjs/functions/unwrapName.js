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
var unwrapName_exports = {};
__export(unwrapName_exports, {
  default: () => unwrapName_default
});
module.exports = __toCommonJS(unwrapName_exports);
var import_solidity = require("@ethersproject/solidity");
var import_normalise = require("../utils/normalise");
var import_validation = require("../utils/validation");
async function unwrapName_default({ contracts, signer }, name, {
  newController,
  newRegistrant
}) {
  const labels = name.split(".");
  const labelhash = (0, import_solidity.keccak256)(["string"], [labels[0]]);
  const parentNodehash = (0, import_normalise.namehash)(labels.slice(1).join("."));
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  if ((0, import_validation.checkIsDotEth)(labels)) {
    if (!newRegistrant) {
      throw new Error("newRegistrant must be specified for .eth names");
    }
    return nameWrapper.populateTransaction.unwrapETH2LD(
      labelhash,
      newRegistrant,
      newController
    );
  }
  if (newRegistrant) {
    throw new Error("newRegistrant can only be specified for .eth names");
  }
  return nameWrapper.populateTransaction.unwrap(
    parentNodehash,
    labelhash,
    newController
  );
}
