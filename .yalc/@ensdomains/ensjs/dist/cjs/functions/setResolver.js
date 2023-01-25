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
var setResolver_exports = {};
__export(setResolver_exports, {
  default: () => setResolver_default
});
module.exports = __toCommonJS(setResolver_exports);
var import_normalise = require("../utils/normalise");
async function setResolver_default({ contracts, signer }, name, {
  contract,
  resolver
}) {
  if (!resolver) {
    resolver = (await contracts.getPublicResolver()).address;
  }
  switch (contract) {
    case "registry": {
      const registry = (await (contracts == null ? void 0 : contracts.getRegistry())).connect(signer);
      return registry.populateTransaction.setResolver((0, import_normalise.namehash)(name), resolver);
    }
    case "nameWrapper": {
      const nameWrapper = (await (contracts == null ? void 0 : contracts.getNameWrapper())).connect(signer);
      return nameWrapper.populateTransaction.setResolver(
        (0, import_normalise.namehash)(name),
        resolver
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
