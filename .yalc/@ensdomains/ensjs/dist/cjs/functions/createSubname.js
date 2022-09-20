"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var createSubname_exports = {};
__export(createSubname_exports, {
  default: () => createSubname_default
});
module.exports = __toCommonJS(createSubname_exports);
var import_ethers = require("ethers");
var import_generateFuseInput = __toESM(require("../utils/generateFuseInput"));
var import_normalise = require("../utils/normalise");
var import_wrapperExpiry = require("../utils/wrapperExpiry");
async function createSubname_default({
  contracts,
  signer,
  getExpiry
}, name, { owner, resolverAddress, contract, ...wrapperArgs }) {
  const labels = name.split(".");
  if (labels.length === 1) {
    throw new Error("Subnames in ENS.js can only be created for 2LDs, not TLDs");
  }
  if ("fuses" in wrapperArgs && contract === "registry") {
    throw new Error("Fuses can only be set on a wrapped name");
  }
  if (!resolverAddress) {
    resolverAddress = (await contracts?.getPublicResolver()).address;
  }
  const label = labels.shift();
  const labelhash = import_ethers.ethers.utils.solidityKeccak256(["string"], [label]);
  const parentNodehash = (0, import_normalise.namehash)(labels.join("."));
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      return registry.populateTransaction.setSubnodeRecord(
        parentNodehash,
        labelhash,
        owner,
        resolverAddress,
        0
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const expiry = await (0, import_wrapperExpiry.makeExpiry)(
        { getExpiry },
        name,
        "expiry" in wrapperArgs ? wrapperArgs.expiry : void 0
      );
      const generatedFuses = "fuses" in wrapperArgs && wrapperArgs.fuses ? (0, import_generateFuseInput.default)(wrapperArgs.fuses) : "0";
      return nameWrapper.populateTransaction.setSubnodeRecord(
        parentNodehash,
        label,
        owner,
        resolverAddress,
        0,
        generatedFuses,
        expiry
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
