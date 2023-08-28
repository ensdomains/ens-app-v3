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
var deleteSubname_exports = {};
__export(deleteSubname_exports, {
  default: () => deleteSubname_default
});
module.exports = __toCommonJS(deleteSubname_exports);
var import_solidity = require("@ethersproject/solidity");
var import_normalise = require("../utils/normalise");
async function deleteSubname_default({ contracts, signer }, name, { contract, ...args }) {
  const labels = name.split(".");
  if (labels.length < 3) {
    throw new Error(`${name} is not a valid subname`);
  }
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      const label = labels.shift();
      const labelhash = (0, import_solidity.keccak256)(["string"], [label]);
      const parentNodehash = (0, import_normalise.namehash)(labels.join("."));
      return registry.populateTransaction.setSubnodeRecord(
        parentNodehash,
        labelhash,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        0
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const { method } = args;
      if (method === "setRecord") {
        const node = (0, import_normalise.namehash)(name);
        return nameWrapper.populateTransaction.setRecord(
          node,
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          0
        );
      }
      const label = labels.shift();
      const parentNodehash = (0, import_normalise.namehash)(labels.join("."));
      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        "0x0000000000000000000000000000000000000000",
        0,
        0
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
