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
var consts_exports = {};
__export(consts_exports, {
  EMPTY_ADDRESS: () => EMPTY_ADDRESS,
  MAX_DATE_INT: () => MAX_DATE_INT,
  MAX_INT_64: () => MAX_INT_64,
  MINIMUM_DOT_ETH_CHARS: () => MINIMUM_DOT_ETH_CHARS
});
module.exports = __toCommonJS(consts_exports);
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_INT_64 = BigInt("18446744073709551615");
const MAX_DATE_INT = 864e13;
const MINIMUM_DOT_ETH_CHARS = 3;
