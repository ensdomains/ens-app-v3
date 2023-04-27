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
var renewNames_exports = {};
__export(renewNames_exports, {
  default: () => renewNames_default,
  extendWrappedName: () => extendWrappedName
});
module.exports = __toCommonJS(renewNames_exports);
var import_consts = require("../utils/consts");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
async function extendWrappedName({ contracts }, name, options) {
  const expiry = (options == null ? void 0 : options.duration) || import_consts.MAX_INT_64;
  const labels = name.split(".");
  const labelHash = (0, import_labels.labelhash)(labels.shift());
  const parentNode = (0, import_normalise.namehash)(labels.join("."));
  const nameWrapper = await contracts.getNameWrapper();
  return nameWrapper.populateTransaction.extendExpiry(
    parentNode,
    labelHash,
    expiry
  );
}
async function renewNames_default({ contracts }, nameOrNames, { duration, value }) {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
  const labels = names.map((name) => {
    const label = name.split(".");
    if (label.length !== 2 || label[1] !== "eth") {
      throw new Error("Currently only .eth TLD renewals are supported");
    }
    return label[0];
  });
  if (labels.length === 1) {
    const controller = await contracts.getEthRegistrarController();
    return controller.populateTransaction.renew(labels[0], duration, { value });
  }
  const bulkRenewal = await contracts.getBulkRenewal();
  return bulkRenewal.populateTransaction.renewAll(labels, duration, { value });
}
