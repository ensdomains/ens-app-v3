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
var wrapperExpiry_exports = {};
__export(wrapperExpiry_exports, {
  MAX_EXPIRY: () => MAX_EXPIRY,
  makeExpiry: () => makeExpiry
});
module.exports = __toCommonJS(wrapperExpiry_exports);
var import_ethers = require("ethers");
const MAX_EXPIRY = import_ethers.BigNumber.from(2).pow(64).sub(1);
const makeExpiry = async ({ getExpiry }, name, expiry) => {
  if (expiry) {
    if (expiry instanceof Date) {
      return import_ethers.BigNumber.from(expiry.getTime() / 1e3);
    }
    if (expiry instanceof import_ethers.BigNumber) {
      return expiry;
    }
    return import_ethers.BigNumber.from(expiry);
  }
  if (name.endsWith(".eth")) {
    const expResponse = await getExpiry(name);
    if (!expResponse?.expiry)
      throw new Error("Couldn't get expiry for name, please provide one.");
    return import_ethers.BigNumber.from(expResponse.expiry.getTime() / 1e3);
  }
  return MAX_EXPIRY;
};
