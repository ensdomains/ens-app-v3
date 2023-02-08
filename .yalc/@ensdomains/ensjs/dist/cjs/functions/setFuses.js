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
var setFuses_exports = {};
__export(setFuses_exports, {
  default: () => setFuses_default,
  setChildFuses: () => setChildFuses
});
module.exports = __toCommonJS(setFuses_exports);
var import_fuses = require("../utils/fuses");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
async function setChildFuses({ contracts, signer }, name, {
  fuses,
  expiry = 0
}) {
  const encodedFuses = (0, import_fuses.encodeFuses)(fuses);
  const labels = name.split(".");
  const labelHash = (0, import_labels.labelhash)(labels.shift());
  const parentNode = (0, import_normalise.namehash)(labels.join("."));
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  return nameWrapper.populateTransaction.setChildFuses(
    parentNode,
    labelHash,
    encodedFuses,
    expiry
  );
}
async function setFuses_default({ contracts, signer }, name, props) {
  const encodedFuses = (0, import_fuses.encodeFuses)(props, "child");
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const hash = (0, import_normalise.namehash)(name);
  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
