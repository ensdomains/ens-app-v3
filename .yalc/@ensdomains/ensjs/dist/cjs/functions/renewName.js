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
var renewName_exports = {};
__export(renewName_exports, {
  default: () => renewName_default
});
module.exports = __toCommonJS(renewName_exports);
async function renewName_default({ contracts }, name, {
  duration,
  value
}) {
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth")
    throw new Error("Currently only .eth TLD renewals are supported");
  const controller = await contracts.getEthRegistrarController();
  return controller.populateTransaction.renew(labels[0], duration, { value });
}
