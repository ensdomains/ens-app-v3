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
var setName_exports = {};
__export(setName_exports, {
  default: () => setName_default
});
module.exports = __toCommonJS(setName_exports);
async function setName_default({ contracts, signer }, name, {
  address,
  resolver
} = {}) {
  var _a;
  const signerAddress = await signer.getAddress();
  const reverseRegistrar = (_a = await (contracts == null ? void 0 : contracts.getReverseRegistrar())) == null ? void 0 : _a.connect(
    signer
  );
  if (address) {
    const publicResolver = await (contracts == null ? void 0 : contracts.getPublicResolver());
    return reverseRegistrar.populateTransaction.setNameForAddr(
      address,
      signerAddress,
      resolver || publicResolver.address,
      name
    );
  }
  return reverseRegistrar.populateTransaction.setName(name);
}
