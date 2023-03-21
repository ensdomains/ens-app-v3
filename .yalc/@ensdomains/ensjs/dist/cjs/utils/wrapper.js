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
var wrapper_exports = {};
__export(wrapper_exports, {
  MAX_EXPIRY: () => MAX_EXPIRY,
  expiryToBigNumber: () => expiryToBigNumber,
  makeExpiry: () => makeExpiry,
  wrappedLabelLengthCheck: () => wrappedLabelLengthCheck
});
module.exports = __toCommonJS(wrapper_exports);
var import_bignumber = require("@ethersproject/bignumber");
var import_strings = require("@ethersproject/strings");
const MAX_EXPIRY = import_bignumber.BigNumber.from(2).pow(64).sub(1);
const expiryToBigNumber = (expiry, defaultValue = 0) => {
  if (!expiry)
    return import_bignumber.BigNumber.from(defaultValue);
  if (expiry instanceof Date) {
    return import_bignumber.BigNumber.from(expiry.getTime() / 1e3);
  }
  if (expiry instanceof import_bignumber.BigNumber) {
    return expiry;
  }
  return import_bignumber.BigNumber.from(expiry);
};
const makeExpiry = async ({ getExpiry }, name, expiry) => {
  if (expiry)
    return expiryToBigNumber(expiry);
  if (name.endsWith(".eth")) {
    const expResponse = await getExpiry(name);
    if (!(expResponse == null ? void 0 : expResponse.expiry))
      throw new Error("Couldn't get expiry for name, please provide one.");
    return import_bignumber.BigNumber.from(expResponse.expiry.getTime() / 1e3);
  }
  return MAX_EXPIRY;
};
const wrappedLabelLengthCheck = (label) => {
  const bytes = (0, import_strings.toUtf8Bytes)(label);
  if (bytes.byteLength > 255)
    throw new Error("Label can't be longer than 255 bytes");
};
