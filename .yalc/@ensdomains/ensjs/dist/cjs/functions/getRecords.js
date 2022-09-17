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
var getRecords_exports = {};
__export(getRecords_exports, {
  default: () => getRecords_default
});
module.exports = __toCommonJS(getRecords_exports);
var import_validation = require("../utils/validation");
async function getRecords_default({ getProfile }, name, options) {
  const inputType = (0, import_validation.parseInputType)(name);
  if (inputType.type !== "name" && inputType.type !== "label") {
    throw new Error("Input must be an ENS name");
  }
  return getProfile(name, options);
}
