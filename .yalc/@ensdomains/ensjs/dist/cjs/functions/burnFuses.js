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
  const encodedFuses = (0, import_fuses.validateFuses)(props);
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const hash = (0, import_normalise.namehash)(name);
  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
