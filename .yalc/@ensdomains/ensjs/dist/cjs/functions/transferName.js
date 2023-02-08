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
var transferName_exports = {};
__export(transferName_exports, {
  default: () => transferName_default
});
module.exports = __toCommonJS(transferName_exports);
var import_solidity = require("@ethersproject/solidity");
var import_normalise = require("../utils/normalise");
async function transferName_default({ contracts, signer }, name, {
  newOwner,
  contract,
  reclaim
}) {
  const address = await signer.getAddress();
  switch (contract) {
    case "registry": {
      const registry = (await (contracts == null ? void 0 : contracts.getRegistry())).connect(signer);
      return registry.populateTransaction.setOwner((0, import_normalise.namehash)(name), newOwner);
    }
    case "baseRegistrar": {
      const baseRegistrar = (await (contracts == null ? void 0 : contracts.getBaseRegistrar())).connect(
        signer
      );
      const labels = name.split(".");
      if (labels.length > 2 || labels[labels.length - 1] !== "eth") {
        throw new Error("Invalid name for baseRegistrar");
      }
      const tokenId = (0, import_solidity.keccak256)(["string"], [labels[0]]);
      if (reclaim) {
        return baseRegistrar.populateTransaction.reclaim(tokenId, newOwner);
      }
      return baseRegistrar.populateTransaction["safeTransferFrom(address,address,uint256)"](address, newOwner, tokenId);
    }
    case "nameWrapper": {
      const nameWrapper = (await (contracts == null ? void 0 : contracts.getNameWrapper())).connect(signer);
      return nameWrapper.populateTransaction.safeTransferFrom(
        address,
        newOwner,
        (0, import_normalise.namehash)(name),
        1,
        "0x"
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
