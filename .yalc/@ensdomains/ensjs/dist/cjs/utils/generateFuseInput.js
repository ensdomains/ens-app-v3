"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var generateFuseInput_exports = {};
__export(generateFuseInput_exports, {
  default: () => generateFuseInput_default
});
module.exports = __toCommonJS(generateFuseInput_exports);
var import_ethers = require("ethers");
var import_fuses = __toESM(require("./fuses"));
var generateFuseInput_default = (fuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions).filter(
    (opt) => fuseOptions[opt] === true
  );
  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(import_fuses.default[curr]);
  }, import_ethers.ethers.BigNumber.from(0));
  return bigNumberFuses.toHexString();
};
