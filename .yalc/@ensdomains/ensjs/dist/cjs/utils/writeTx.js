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
var writeTx_exports = {};
__export(writeTx_exports, {
  default: () => writeTx_default
});
module.exports = __toCommonJS(writeTx_exports);
const withCustomData = (tx, customData) => customData ? { ...tx, customData } : tx;
var writeTx_default = (signer, populate) => ({ customData, ...tx }) => populate ? withCustomData(tx, customData) : signer.sendTransaction(tx).then((r) => withCustomData(r, customData));
