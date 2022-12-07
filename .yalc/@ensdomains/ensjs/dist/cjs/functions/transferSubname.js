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
var transferSubname_exports = {};
__export(transferSubname_exports, {
  default: () => transferSubname_default
});
module.exports = __toCommonJS(transferSubname_exports);
var import_ethers = require("ethers");
var import_normalise = require("../utils/normalise");
var import_wrapper = require("../utils/wrapper");
async function transferSubname_default({
  contracts,
  signer,
  getExpiry
}, name, { contract, owner, resolverAddress, ...wrapperArgs }) {
  const labels = name.split(".");
  const label = labels.shift();
  const labelhash = import_ethers.ethers.utils.solidityKeccak256(["string"], [label]);
  const parentNodehash = (0, import_normalise.namehash)(labels.join("."));
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      return registry.populateTransaction.setSubnodeOwner(
        parentNodehash,
        labelhash,
        owner
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const expiry = await (0, import_wrapper.makeExpiry)(
        { getExpiry },
        labels.join("."),
        "expiry" in wrapperArgs ? wrapperArgs.expiry : void 0
      );
      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        owner,
        "0",
        expiry
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
