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
var getAvailable_exports = {};
__export(getAvailable_exports, {
  default: () => getAvailable_default
});
module.exports = __toCommonJS(getAvailable_exports);
var import_labels = require("../utils/labels");
const raw = async ({ contracts }, name) => {
  const baseRegistrar = await (contracts == null ? void 0 : contracts.getBaseRegistrar());
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth") {
    throw new Error("Currently only .eth names can be checked for availability");
  }
  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData("available", [
      (0, import_labels.labelhash)(labels[0])
    ])
  };
};
const decode = async ({ contracts }, data) => {
  if (data === null)
    return;
  const baseRegistrar = await (contracts == null ? void 0 : contracts.getBaseRegistrar());
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      "available",
      data
    );
    return result["0"];
  } catch {
    return;
  }
};
var getAvailable_default = {
  raw,
  decode
};
