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
var transferController_exports = {};
__export(transferController_exports, {
  default: () => transferController_default
});
module.exports = __toCommonJS(transferController_exports);
var import_solidity = require("@ethersproject/solidity");
async function transferController_default({ contracts, signer }, name, {
  newOwner,
  isOwner
}) {
  const baseRegistrar = (await (contracts == null ? void 0 : contracts.getBaseRegistrar())).connect(signer);
  const registry = (await (contracts == null ? void 0 : contracts.getRegistry())).connect(signer);
  const labels = name.split(".");
  if (isOwner) {
    return registry.populateTransaction.setOwner(
      (0, import_solidity.keccak256)(["string"], [labels[0]]),
      newOwner
    );
  }
  return baseRegistrar.populateTransaction.reclaim(
    (0, import_solidity.keccak256)(["string"], [labels[0]]),
    newOwner
  );
}
